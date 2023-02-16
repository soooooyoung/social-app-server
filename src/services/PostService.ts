import { Service } from "typedi";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { PostRepository } from "./repositories/PostRepository";
import { Post, PostQueryResponse, AuthTokenJWT } from "../models";
import { logError } from "../utils/Logger";
import { FriendshipRepository } from "./repositories/FriendshipRepository";

@Service()
export class PostService {
  private posts: PostRepository = new PostRepository();
  private friends: FriendshipRepository = new FriendshipRepository();
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

  public findAllPostsById = async (userId: number, authToken: string) => {
    try {
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        userId,
        token.user.userId
      );

      let result: PostQueryResponse[] = [];
      if (checkOwnership) {
        result = await this.posts.findAllPosts(
          { userId },
          "created_date",
          "desc"
        );
      } else if (token && token?.user?.userId) {
        const checkFriendship = await this.friends.findFriendShip(
          userId,
          token.user.userId,
          "A"
        );
        if (checkFriendship && checkFriendship.length > 0) {
          result = await this.posts.unionAll(
            { userId, statusCode: "F" },
            { userId, statusCode: "G" },
            "created_date",
            "desc"
          );
        }
      } else {
        result = await this.posts.findAllPosts(
          { userId, statusCode: "G" },
          "created_date",
          "desc"
        );
      }

      return result.reduce((prev, curr, idx) => {
        const found = prev.find((data) => data.postId === curr.postId);
        if (found && curr.likerId) {
          prev[prev.indexOf(found)].likedIds?.push(curr.likerId);
          return prev;
        }
        const newPost: Post = {
          postId: curr.postId,
          statusCode: curr.statusCode,
          created_date: curr.created_date,
          updated_date: curr.updated_date,
          content: curr.content,
          userId: curr.userId,
          likedIds: curr.likerId ? [curr.likerId] : [],
        };

        return [...prev, newPost];
      }, [] as Post[]);
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public savePost = async (userId: number, authToken: string, post: Post) => {
    try {
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        userId,
        token.user.userId
      );
      if (checkOwnership) {
        const result = await this.posts.save({
          statusCode: post.statusCode,
          content: post.content,
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
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        userId,
        token.user.userId
      );
      if (checkOwnership && post.postId) {
        const result = await this.posts.update(userId, post.postId, {
          statusCode: post.statusCode,
          content: post.content,
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
      const token = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      const checkOwnership = await this.compareAuthToken(
        userId,
        token.user.userId
      );
      if (checkOwnership) {
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
