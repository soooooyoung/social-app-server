import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { PostRepository } from "./repositories/PostRepository";

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
      throw new IllegalStateException("Unable to Compare Auth Token");
    }
  };

  public findAllPostsById = async (userId: string, authToken: string) => {
    try {
      const checkPermissions = await this.compareAuthToken(userId, authToken);
      if (checkPermissions) {
        const result = await this.posts.findAll({ userId });
        console.log("POSTS", result);
        return result;
      }
      return false;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
}
