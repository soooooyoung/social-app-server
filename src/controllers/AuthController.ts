import { Response, Request } from "express";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  Header,
  Req,
  HeaderParams,
  Body,
} from "routing-controllers";
import { AuthService } from "../services/AuthService";
import { Inject, Service } from "typedi";
import { DokiResponse, LoginParam, BaseHeaderParam } from "../models";
import { BaseController } from "./BaseController";
import { ResponseUtils } from "../utils/ResponseUtils";

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

      console.log("AUTH", auth);

      if (auth && username && password) {
        const userData = await this.authService.login(username, password);

        // console.log("User", user);
      }

      // if (await this.checkAuth((key) => header[key])) {
      //   // TODO login and return user data
      //   const response: DokiResponse = await this.authService.login();
      // }

      return res.status(200).json(response.getMono());
    } catch (e) {
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
  public async accessToken(@Res() res: Response) {
    try {
      //TODO: access token
      const result = await this.authService.checkAuthToken();
      console.log("RESULT:", result);
      const response: DokiResponse = {
        success: true,
        result: "ff",
      };

      return res.status(200).json(response);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
