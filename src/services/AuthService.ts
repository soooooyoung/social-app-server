import { User } from "models";
import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode, matches } from "../utils/security/PasswordEncoder";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class AuthService {
  private auth: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();

  public login = async (
    username: string,
    password: string
  ): Promise<
    | {
        user: User;
        authToken: string;
      }
    | undefined
  > => {
    const user = await this.auth.findById({ username });
    console.log("USER:", user);
    if (user) {
      const result = await matches(password, user.password);
      if (result) {
        // TODO token
        const authToken = "";
        return { user, authToken };
      }
    }
  };

  public checkAuthToken = async () => {
    return await encode("0418");
  };
}
