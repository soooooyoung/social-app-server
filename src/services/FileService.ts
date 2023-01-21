import { IllegalStateException } from "../models/exceptions";
import { Service } from "typedi";
import { Friendship, AuthTokenJWT } from "../models";
import { logError } from "../utils/Logger";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { FileRepository } from "./repositories/FileRepostory";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class FileService {
  private friendRepository: FileRepository = new FileRepository();
  private userRepository: UserRepository = new UserRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  public checkUserPermission = async (userId: number, authToken: string) => {
    try {
      const result = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      if (result.user && result.user.userId === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError("FRIEND REQUEST INVALID PERMISSION:", e);
      throw e;
    }
  };
}
