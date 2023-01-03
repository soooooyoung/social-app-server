import { User } from "models";
import { Service } from "typedi";
import { clearPrivateData } from "utils/security/dataUtils";
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
      console.log(e);
      throw e;
    }
  };

  public checkAuthToken = async (token: string) => {
    const userId = await this.tokenUtil.verifyToken(token);
    if (userId) {
      const user = await this.auth.findById({ userId });
      return user;
    }
  };

  public generateToken = (user: User) => {
    return this.tokenUtil.generateAuthToken(user);
  };
}
