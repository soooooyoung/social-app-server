import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode } from "../utils/security/PasswordEncoder";
import { User, EmailJWT } from "../models";
import { UserRepository } from "./repositories/UserRepository";
import { logError, logInfo } from "../utils/Logger";

@Service()
export class UserService {
  private userRepository: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();
  private generateToken = (user: User) => {
    return this.tokenUtil.generateAuthToken(user);
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

  public signUpUser = async (user: User) => {
    try {
      const isSafe = await this.checkIsSafe(user);

      if (isSafe) {
        if (user && user.password) {
          const encodedPw = await encode(user.password);
          user.password = encodedPw;
          user.status = "ACTIVE";
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
      throw e;
    }
  };
  public checkSignupToken = async (token: string) => {
    const payload = await this.tokenUtil.verifyToken(token);
    if (payload && typeof payload === "object") {
      return payload as EmailJWT;
    }
    return false;
  };
}
