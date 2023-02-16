import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { CommentRepository } from "./repositories/CommentRepository";
import { Comment } from "../models";
import { logError } from "../utils/Logger";
import { AuthTokenJWT } from "../models/";

@Service()
export class CommentService {
  private comments: CommentRepository = new CommentRepository();
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

  public getAllComments = async (authToken: string, postId: number) => {
    try {
      if (!postId) {
        throw new IllegalStateException("postId is required");
      }
      return await this.comments.findAllComments({ postId });
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public saveComment = async (authToken: string, item: Comment) => {
    try {
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      if (token.user.userId) {
        await this.comments.save({ ...item, userId: token.user.userId });
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public deleteComment = async (authToken: string, item: Comment) => {
    try {
      if (!item.userId) {
        throw new IllegalStateException("userId is required");
      }
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        item.userId,
        token.user.userId
      );
      if (checkOwnership) {
        const result = await this.comments.delete(item);
        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };
}
