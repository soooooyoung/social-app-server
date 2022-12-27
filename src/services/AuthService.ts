import { User } from "models";
import { Service } from "typedi";
import { InvalidKeyException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode, matches } from "../utils/security/PasswordEncoder";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class AuthService {
  private auth: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();

  public login = async (username: string, password: string) => {
    try {
      const user = await this.auth.findById({ username });
      if (user) {
        const result = await matches(password, user.password);
        console.log("RESULT", result);
        if (result) {
          // TODO token
          const authToken = "";
          return true;
        }
      }
      return false;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  public checkAuthToken = async () => {
    return await encode("0418");
  };
}
