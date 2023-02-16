import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode } from "../utils/security/PasswordEncoder";
import { User, EmailJWT, AuthTokenJWT } from "../models";
import { UserRepository } from "./repositories/UserRepository";
import { logError, logInfo } from "../utils/Logger";
import { IllegalStateException } from "../models/exceptions";
import { clearPrivateData } from "../utils/security/dataUtils";

@Service()
export class UserService {
  private userRepository: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();

  private generateToken = (user: User) => {
    return this.tokenUtil.generateAuthToken(user);
  };

  private getUserId = async (authToken: string) => {
    const authData = await this.tokenUtil.verifyToken<AuthTokenJWT>(authToken);
    if (authData && authData.user) {
      return authData.user.userId;
    }
  };

  private checkPermissions = async (userId: number, authToken: string) => {
    const authData = await this.tokenUtil.verifyToken<AuthTokenJWT>(authToken);

    if (authData.user.userId === userId) {
      return true;
    }
    return false;
  };

  public checkIsSafe = async ({ email, username }: User) => {
    let found = await this.userRepository.findById({ email });
    if (!found) {
      found = await this.userRepository.findById({ username });
    }
    if (found) {
      return false;
    }
    return true;
  };

  public getUser = async (userId: number, authToken: string) => {
    try {
      if (!userId) {
        throw new IllegalStateException("UserId Required");
      }

      const isOwner = await this.checkPermissions(userId, authToken);
      const userData = await this.userRepository.findById({ userId });
      if (isOwner) {
        return userData;
      }

      return {
        username: userData.username,
        userId: userData.userId,
        email: userData.email,
        nickname: userData.nickname,
        intro: userData.intro,
        profileImgUrl: userData.profileImgUrl,
      };
    } catch (e) {
      logError("Get user failed", e);
    }
  };

  public editUser = async (user: User, authToken: string) => {
    try {
      if (!user.userId) {
        throw new IllegalStateException("UserId Required");
      }
      const isOwner = await this.checkPermissions(user.userId, authToken);
      if (isOwner) {
        return await this.userRepository.update(user.userId, user);
      }
    } catch (e) {
      logError("Edit user failed", e);
    }
  };

  public signUpUser = async (user: User) => {
    try {
      const isSafe = await this.checkIsSafe(user);

      if (isSafe) {
        if (user && user.password) {
          const encodedPw = await encode(user.password);
          user.password = encodedPw;

          const userId = await this.userRepository.save(user);
          if (userId) {
            user.userId = userId;
            logInfo("USER SIGN UP:", user);
            const authToken = await this.generateToken(user);
            return { authToken, user };
          }
        }
      }
      return false;
    } catch (e) {
      logError(e);
      return false;
    }
  };
  public checkSignupToken = async (token: string) => {
    const payload = await this.tokenUtil.verifyToken<EmailJWT>(token);
    if (payload && typeof payload === "object") {
      return payload;
    }
    return false;
  };

  /**
   *
   * @param authToken authentication jwt
   * @param keyword partial nickname or username
   * @returns array of users excluding searcher
   */
  public fetchUsers = async (authToken: string, keyword: string) => {
    try {
      const userId = await this.getUserId(authToken);
      if (userId) {
        const results = (await this.userRepository.findUsersByKeyword(
          userId,
          keyword
        )) as User[];
        if (results) return results.map((user) => clearPrivateData(user));
      }
    } catch (e) {
      logError(e);
      return false;
    }
  };
}
