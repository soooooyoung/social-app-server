import { Response } from "express";
import { Inject, Service } from "typedi";
import {
  JsonController,
  HttpCode,
  Get,
  Res,
  Post,
  Delete,
  HeaderParams,
  Param,
  CookieParam,
  Body,
  Patch,
  QueryParam,
} from "routing-controllers";
import { BaseController } from "./BaseController";
import {
  BaseHeaderParam,
  FriendshipParam,
} from "../models";
import { logError } from "../utils/Logger";
import { FriendService } from "../services/FriendService";

//TODO: change all parameters to object for safer transportation
@Service()
@JsonController("/v1/friend")
export class FriendController extends BaseController {
  @Inject()
  private friendService: FriendService = new FriendService();

  /**
   * Get
   */
  @HttpCode(200)
  @Get("/:userId")
  public async getUserFriendById(
    @Res() res: Response,
    @Param("userId") userId: string,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);
      if (auth) {
        const userPermission = await this.friendService.checkUserPermission(
          userId,
          authToken
        );
        if (userPermission) {
          const response = await this.friendService.findAllFriendsById(userId);
          console.log("freinds", response);
          return res.status(200).json({
            success: true,
            result: response,
          });
        }
      }

      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }

  /**
   * Create Friendship Request
   */
  @HttpCode(200)
  @Post("")
  public async createFriendshipRequest(
    @Res() res: Response,
    @Body()
    { requesterId, addresseeId }: FriendshipParam,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);
      if (auth && requesterId && addresseeId) {
        const userPermission = await this.friendService.checkUserPermission(
          requesterId,
          authToken
        );
        if (userPermission) {
          const response = await this.friendService.createFriendRequest(
            requesterId,
            addresseeId
          );
          return res.status(200).json({
            success: true,
            result: response,
          });
        }
      }
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
  /**
   * Update
   */
  @HttpCode(200)
  @Patch("")
  public async acceptFriendship(
    @Res() res: Response,
    @Body()
    { requesterId, addresseeId }: FriendshipParam,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && requesterId && addresseeId) {
        const userPermission = await this.friendService.checkUserPermission(
          addresseeId,
          authToken
        );
        if (userPermission) {
          const response = await this.friendService.acceptFriendRequest(
            requesterId,
            addresseeId
          );
          return res.status(200).json({
            success: true,
            result: response,
          });
        }
      }
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }

  /**
   * Delete
   */
  @HttpCode(200)
  @Delete("")
  public async deletePost(
    @Res() res: Response,
    @Body()
    { requesterId, addresseeId }: FriendshipParam,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && requesterId && addresseeId) {
        const userPermission = await this.friendService.checkUserPermission(
          addresseeId,
          authToken
        );
        const altPermission = await this.friendService.checkUserPermission(
          requesterId,
          authToken
        );
        if (userPermission || altPermission) {
          const response = await this.friendService.denyFriendRequest(
            requesterId,
            addresseeId
          );
          return res.status(200).json({
            success: true,
            result: response,
          });
        }
      }
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
