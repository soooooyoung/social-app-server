import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { PostRepository } from "./repositories/PostRepository";
import { Post } from "../models";
import { logError } from "../utils/Logger";

@Service()
export class PostService {
  private posts: PostRepository = new PostRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  private compareAuthToken = async (userId: string, authToken: string) => {
    try {
      const token = await this.tokenUtils.verifyToken(authToken);
      if (token === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError(e);
      throw new IllegalStateException("Unable to Compare Auth Token");
    }
  };

  public findAllPostsById = async (userId: string, authToken: string) => {
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

  public savePost = async (userId: string, authToken: string, post: Post) => {
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

  public updatePost = async (userId: string, authToken: string, post: Post) => {
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
    userId: string,
    authToken: string,
    postId: string
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
