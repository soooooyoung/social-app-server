import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { LikeRepository } from "./repositories/LikeRepository";
import { Like } from "../models";
import { logError } from "../utils/Logger";
import { AuthTokenJWT } from "../models/";
import { FriendshipRepository } from "./repositories/FriendshipRepository";

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

  //   public findAllLikesById = async (userId: number, authToken: string) => {
  //     try {
  //       const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
  //       const checkOwnership = await this.compareAuthToken(
  //         userId,
  //         token.user.userId
  //       );
  //       if (checkOwnership) {

  //       } else if (token && token?.user?.userId) {
  //         const checkFriendship = await this.friends.findFriendShip(
  //           userId,
  //           token.user.userId,
  //           "A"
  //         );
  //         if (checkFriendship && checkFriendship.length > 0) {
  //           const result = await this.likes.unionAll(
  //             { userId, statusCode: "F" },
  //             { userId, statusCode: "G" },
  //             "created_date",
  //             "desc"
  //           );
  //           return result;
  //         }
  //       }
  //       const result = await this.likes.findAll(
  //         { userId, statusCode: "G" },
  //         "created_date",
  //         "desc"
  //       );
  //       return result;
  //     } catch (e) {
  //       logError(e);
  //       throw e;
  //     }
  //   };

  public saveLike = async (authToken: string, item: Like) => {
    try {
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
