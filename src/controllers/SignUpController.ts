import { Response } from "express";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  Body,
  Param,
  Get,
  QueryParam,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { User, SignupParam, SignupEmailLinkParam, EmailJWT } from "../models";
import { logError, logInfo } from "../utils/Logger";

@Service()
@JsonController("/v1/signup")
export class SignUpController {
  @Inject()
  private userService: UserService = new UserService();

  /**
   * SIGNUP THROUGH CONFIRMATION MAIL
   */
  @HttpCode(200)
  @Get("/verify")
  public async verifyEmail(
    @Res() res: Response,
    @QueryParam("token") token: string
  ) {
    try {
      if (token) {
        const checkToken = await this.userService.checkSignupToken(token);
        if (checkToken && checkToken.user) {
          const response = await this.userService.signUpUser(checkToken.user);
          if (response) {
            return res.status(200).json({
              success: true,
              error: null,
              result: response,
            });
          }
        }
      }

      logError("ERROR SIGN UP:", token);
      return res.status(400).json({
        success: false,
        error: "Sign up Failed",
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
   * SIGNUP
   */
  // @HttpCode(200)
  // @Post("")
  // public async signUp(@Res() res: Response, @Body() user: SignupParam) {
  //   try {
  //     const response = await this.userService.signUpUser(user as User);

  //     if (!response) {
  //       logError("ERROR SIGN UP:", user);
  //       return res.status(400).json({
  //         success: false,
  //         error: "Sign up Failed",
  //       });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       error: null,
  //     });
  //   } catch (e) {
  //     logError(e);
  //     return res.status(400).json({
  //       success: false,
  //       error: e,
  //     });
  //   }
  // }

  @HttpCode(200)
  @Post("/check")
  public async checkDuplicate(@Res() res: Response, @Body() user: SignupParam) {
    try {
      const response = await this.userService.checkIsSafe(user as User);

      return res.status(200).json({
        success: true,
        error: null,
        result: {
          isSafe: response,
        },
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
