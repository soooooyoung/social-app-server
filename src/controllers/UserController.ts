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
    @QueryParams()
    queryParams: UserQueryParams,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken) {
        const response = this.userService.fetchUsers(queryParams);
        return res.status(401).json(response);
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
  @Post("/:userId")
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
