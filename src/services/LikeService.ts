import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { LikeRepository } from "./repositories/LikeRepository";
import { Like } from "../models";
import { logError } from "../utils/Logger";
import { AuthTokenJWT } from "../models/";

@Service()
export class LikeService {
  private likes: LikeRepository = new LikeRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  private compareAuthToken = async (userId: number, authToken?: number) => {
    try {
      if (authToken === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError(e);
      throw new IllegalStateException("Unable to Compare Auth Token");
    }
  };

  public saveLike = async (authToken: string, item: Like) => {
    try {
      if (!item.likerId) {
        throw new IllegalStateException("liker Id is required");
      }
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        item.likerId,
        token.user.userId
      );
      if (checkOwnership) {
        await this.likes.save(item);
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public deleteLike = async (authToken: string, item: Like) => {
    try {
      if (!item.likerId) {
        throw new IllegalStateException("liker Id is required");
      }
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        item.likerId,
        token.user.userId
      );
      if (checkOwnership) {
        const result = await this.likes.delete(item);
        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };
}
