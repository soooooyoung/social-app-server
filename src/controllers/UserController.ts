import { Response } from "express";
import { Inject, Service } from "typedi";
import {
  JsonController,
  HttpCode,
  Get,
  Res,
  HeaderParams,
  CookieParam,
  QueryParams,
  Post,
  Param,
  Body,
  Patch,
  QueryParam,
} from "routing-controllers";
import { BaseController } from "./BaseController";
import { BaseHeaderParam, User, UserQueryParams } from "../models";
import { logError } from "../utils/Logger";

import { UserService } from "../services/UserService";

@Service()
@JsonController("/v1/user")
export class FriendController extends BaseController {
  @Inject()
  private userService: UserService = new UserService();

  /**
   * Get
   */
  @HttpCode(200)
  @Get("")
  public async getUsers(
    @Res() res: Response,
    @QueryParam("q")
    keyword: string,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken) {
        const response = await this.userService.fetchUsers(authToken, keyword);
        return res.status(200).json(response);
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

  @HttpCode(200)
  @Get("/:userId")
  public async getUserById(
    @Res() res: Response,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken) {
        const response = await this.userService.getUser(userId, authToken);
        return res.status(200).json(response);
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

  @HttpCode(200)
  @Patch("/:userId")
  public async editUser(
    @Res() res: Response,
    @Param("userId") userId: number,
    @Body() data: User,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken) {
        const result = await this.userService.editUser(data, authToken);
        if (result) {
          return res.status(200).json(result);
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
