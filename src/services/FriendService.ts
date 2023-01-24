import { IllegalStateException } from "../models/exceptions";
import { Service } from "typedi";
import { Friendship, AuthTokenJWT } from "../models";
import { logError } from "../utils/Logger";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { FriendshipRepository } from "./repositories/FriendshipRepository";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class FriendService {
  private friendRepository: FriendshipRepository = new FriendshipRepository();
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

  public createFriendRequest = async (
    requesterId: number,
    addresseeId: number
  ) => {
    try {
      const newFriendship: Friendship = {
        requesterId,
        addresseeId,
        statusCode: "R",
      };
      const response = await this.friendRepository.saveOrUpdate(newFriendship);
      return response;
    } catch (e) {
      logError("Duplicate friend request", e);
      throw new IllegalStateException("Duplicate friend request");
    }
  };

  public findFriendRequest = async (
    requesterId: number,
    addresseeId: number
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

  public updateFriendRequest = async (
    requesterId: number,
    addresseeId: number,
    statusCode: "A" | "B" | "D" | "R"
  ) => {
    try {
      const newFriendship: Friendship = {
        requesterId,
        addresseeId,
        statusCode,
      };
      const response = await this.friendRepository.update(
        requesterId,
        addresseeId,
        newFriendship
      );
      return response;
    } catch (e) {
      logError("FRIENDSHIP UPDATE FAILED", e);
      throw e;
    }
  };
  public acceptFriendRequest = async (
    requesterId: number,
    addresseeId: number
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

  public deleteFriendship = async (userId: number, friendId: number) => {
    try {
      const response = await this.friendRepository.delete(userId, friendId);
      return response;
    } catch (e) {
      logError("FRIENDSHIP DELETE FAILED", e);
      throw e;
    }
  };

  public findAllFriendsById = async (userId: number) => {
    try {
      const response: Friendship[] =
        await this.friendRepository.unionAllFriends(userId, "A");

      if (response.length > 0) {
        const userIds = response.reduce((prev, friendship) => {
          if (friendship.statusCode !== "A") {
            return prev;
          }
          if (friendship.addresseeId === userId) {
            prev.push(friendship.requesterId);
          } else {
            prev.push(friendship.addresseeId);
          }
          return prev;
        }, [] as number[]);

        const friends = await this.userRepository.findUsers("userId", userIds, [
          "username",
          "userId",
          "profileImgUrl",
          "nickname",
        ]);
        return friends;
      }
      return [];
    } catch (e) {
      logError("FRIENDSHIP FINDALL FAILED", e);
      throw e;
    }
  };
  public findAllRequestsById = async (userId: number) => {
    try {
      const response: Friendship[] = await this.friendRepository.unionAll(
        userId
      );
      if (response.length > 0) {
        const userIds = response.reduce((prev, friendship) => {
          if (friendship.addresseeId === userId) {
            prev.push(friendship.requesterId);
          } else {
            prev.push(friendship.addresseeId);
          }
          return prev;
        }, [] as number[]);
        const friends = await this.userRepository.findUsers("userId", userIds, [
          "username",
          "userId",
          "profileImgUrl",
          "nickname",
        ]);
        return friends;
      }
      return [];
    } catch (e) {
      logError("FRIENDSHIP FINDALL FAILED", e);
      throw e;
    }
  };
}
