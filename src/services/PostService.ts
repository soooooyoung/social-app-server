import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { PostRepository } from "./repositories/PostRepository";
import { Post, User } from "../models";
import { logError } from "../utils/Logger";
import { AuthTokenJWT } from "../models/";

@Service()
export class PostService {
  private posts: PostRepository = new PostRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  private compareAuthToken = async (userId: number, authToken: string) => {
    try {
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      if (token.user.userId === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError(e);
      throw new IllegalStateException("Unable to Compare Auth Token");
    }
  };

  public findAllPostsById = async (userId: number, authToken: string) => {
    try {
      const checkPermissions = await this.compareAuthToken(userId, authToken);
      if (checkPermissions) {
        const result = await this.posts.findAll(
          { userId },
          "created_date",
          "desc"
        );

        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public savePost = async (userId: number, authToken: string, post: Post) => {
    try {
      const checkPermissions = await this.compareAuthToken(userId, authToken);
      if (checkPermissions) {
        const result = await this.posts.save({
          ...post,
          userId,
        });
        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public updatePost = async (userId: number, authToken: string, post: Post) => {
    try {
      const checkPermissions = await this.compareAuthToken(userId, authToken);
      if (checkPermissions) {
        const result = await this.posts.update(userId, post.postId, {
          ...post,
          userId,
        });
        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public deletePostById = async (
    userId: number,
    authToken: string,
    postId: number
  ) => {
    try {
      const checkPermissions = await this.compareAuthToken(userId, authToken);
      if (checkPermissions) {
        const result = await this.posts.delete(userId, postId);

        return result;
      }
      return false;
    } catch (e) {
      logError(e);
      throw e;
    }
  };
}
