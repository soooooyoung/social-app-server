import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode } from "../utils/security/PasswordEncoder";
import { User } from "../models";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class UserService {
  private userRepository: UserRepository = new UserRepository();
  private tokenUtil: TokenUtils = new TokenUtils();
  private generateToken = (user: User) => {
    return this.tokenUtil.generateAuthToken(user);
  };

  public signUpUser = async (user: User) => {
    try {
      if (user && user.password) {
        const encodedPw = await encode(user.password);
        user.password = encodedPw;
        const result = await this.userRepository.save(user);
        if (result) {
          console.log("USER SAVED", result);
          const authToken = await this.generateToken(user);
          return { authToken, user };
        }
      }
      return {};
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}
