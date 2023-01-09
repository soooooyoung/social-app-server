import { Response } from "express";
import * as dayjs from "dayjs";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  HeaderParams,
  Body,
  CookieParam,
} from "routing-controllers";
import { AuthService } from "../services/AuthService";
import { Inject, Service } from "typedi";
import { LoginParam, BaseHeaderParam } from "../models";
import { BaseController } from "./BaseController";
import { ResponseUtils } from "../utils/ResponseUtils";
import { logError, logInfo } from "../utils/Logger";
import { env } from "../configs/env";

@Service()
@JsonController("/v1")
export class AuthController extends BaseController {
  @Inject()
  private authService: AuthService = new AuthService();

  // TODO: error handling middleware before request for response standardization. currently returning xml format on error.

  /**
   * SIGNIN
   */
  @HttpCode(200)
  @Post("/login")
  public async signIn(
    @Res() res: Response,
    @HeaderParams() header: BaseHeaderParam,
    @Body() { password, username }: LoginParam
  ) {
    try {
      const response = new ResponseUtils();
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && username && password) {
        const userData = await this.authService.login(username, password);
        if (userData && userData.authToken && userData.user) {
          res.cookie("token", userData.authToken, {
            secure: env.isProduction,
            httpOnly: true,
            expires: dayjs().add(7, "days").toDate(),
          });
          response.put("user", userData.user);
          response.validate(true);
          logInfo("USER LOGIN:", userData.user);
        }
      }

      return res.status(200).json(response.getMono());
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }

  /**
   * AccessToken
   */
  @HttpCode(200)
  @Post("/authToken")
  public async accessToken(
    @Res() res: Response,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const response = new ResponseUtils();
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken) {
        const user = await this.authService.checkAuthToken(authToken);
        if (user) {
          response.put("authToken", authToken);
          response.put("user", user);
          response.validate(true);
        }
      }

      return res.status(200).json(response.getMono());
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
