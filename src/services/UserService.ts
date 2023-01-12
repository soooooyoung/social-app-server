import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode } from "../utils/security/PasswordEncoder";
import { User, EmailJWT, UserQueryParams, AuthTokenJWT } from "../models";
import { UserRepository } from "./repositories/UserRepository";
import { logError, logInfo } from "../utils/Logger";
import { IllegalStateException } from "../models/exceptions";

@Service()
export class UserService {
  private userRepository: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();

  private generateToken = (user: User) => {
    return this.tokenUtil.generateAuthToken(user);
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
      console.log(1);
      const isValidRequest = await this.checkPermissions(userId, authToken);
      if (isValidRequest) {
        console.log(2);
        return await this.userRepository.findById({ userId });
      }
    } catch (e) {
      logError("Get user failed", e);
    }
  };

  public editUser = async (user: User, authToken: string) => {
    try {
      if (!user.userId) {
        throw new IllegalStateException("UserId Required");
      }
      const isValidRequest = await this.checkPermissions(
        user.userId,
        authToken
      );
      if (isValidRequest) {
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

  public fetchUsers = async (params: UserQueryParams) => {
    const results = this.userRepository.findProfiles(params);
    return results;
  };
}
