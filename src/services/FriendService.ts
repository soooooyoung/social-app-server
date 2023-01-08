import { Service } from "typedi";
import { Friendship } from "../models";
import { logError } from "../utils/Logger";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { FriendshipRepository } from "./repositories/FriendshipRepository";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class FriendService {
  private friendRepository: FriendshipRepository = new FriendshipRepository();
  private userRepository: UserRepository = new UserRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  public checkUserPermission = async (userId: string, autoToken: string) => {
    try {
      const tokenId = await this.tokenUtils.verifyToken(autoToken);
      if (tokenId && tokenId === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError("FRIEND REQUEST INVALID PERMISSION:", e);
      throw e;
    }
  };

  public createFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    try {
      const newFriendship: Friendship = {
        requesterId,
        addresseeId,
        statusCode: "R",
      };
      const response = await this.friendRepository.save(newFriendship);
      return response;
    } catch (e) {
      logError("FRIEND REQUEST FAILED", e);
      throw e;
    }
  };

  public findFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    try {
      const friendship = await this.friendRepository.findById({
        requesterId,
        addresseeId,
      });
      return friendship;
    } catch (e) {
      logError("FRIENDSHIP SEARCH FAILED", e);
      throw e;
    }
  };

  public acceptFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    try {
      const newFriendship: Friendship = {
        requesterId,
        addresseeId,
        statusCode: "A",
      };

      const response = await this.friendRepository.update(
        requesterId,
        addresseeId,
        newFriendship
      );
      return response;
    } catch (e) {
      logError("FRIENDSHIP ACCEPT FAILED", e);
      throw e;
    }
  };

  public denyFriendRequest = async (
    requesterId: string,
    addresseeId: string
  ) => {
    try {
      const response = await this.friendRepository.delete(
        requesterId,
        addresseeId
      );
      return response;
    } catch (e) {
      logError("FRIENDSHIP DELETE FAILED", e);
      throw e;
    }
  };

  public findAllFriendsById = async (userId: string) => {
    try {
      const response = await this.friendRepository.unionAll(userId, "A");

      if (response.length > 0) {
        const friends = await this.userRepository.findWhereIn(userId, response);
        console.log("friends", friends);
        return friends;
      }
      return [];
    } catch (e) {
      logError("FRIENDSHIP DELETE FAILED", e);
      throw e;
    }
  };
}
