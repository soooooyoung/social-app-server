import { User } from "models";
import { AuthTokenJWT } from "models/JWTPayload";
import { Service } from "typedi";
import { logError } from "../utils/Logger";
import { clearPrivateData } from "../utils/security/dataUtils";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { matches } from "../utils/security/PasswordEncoder";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class AuthService {
  private auth: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();

  public login = async (username: string, password: string) => {
    try {
      const user = await this.auth.findById({ username });
      if (user && user.password) {
        const result = await matches(password, user.password);
        if (result) {
          const authToken = await this.generateToken(user);
          clearPrivateData(user);
          return { authToken, user };
        }
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public checkAuthToken = async (token: string) => {
    const result = await this.tokenUtil.verifyToken<AuthTokenJWT>(token);
    if (result.user && result.user.userId) {
      let verifiedUser = await this.auth.findById({
        userId: result.user.userId,
      });
      return verifiedUser;
    }
  };

  public generateToken = async (user: User) => {
    return await this.tokenUtil.generateAuthToken(user);
  };
}
