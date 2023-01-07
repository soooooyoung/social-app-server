import { Response } from "express";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  Body,
  Param,
  HeaderParams,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { MailService } from "../services/MailService";
import { BaseHeaderParam, User } from "../models";
import { BaseController } from "./BaseController";
import { ResponseUtils } from "../utils/ResponseUtils";
import { logError, logInfo } from "../utils/Logger";

@Service()
@JsonController("/v1/mail")
export class MailController extends BaseController {
  @Inject()
  private mailService: MailService = new MailService();

  /**
   * Mail
   */
  @HttpCode(200)
  @Post("/signup")
  public async sendSignupEmail(
    @Res() res: Response,
    @HeaderParams() header: BaseHeaderParam,
    @Body() user: User
  ) {
    try {
      const response = new ResponseUtils();
      const auth = await this.checkAuth((key) => header[key]);
      if (auth && user.email !== undefined) {
        const { username, token } =
          await this.mailService.generateConfirmationCode(user);
        await this.mailService.sendMail(user.email, token, username);
        response.put("sent", user.email);
        response.validate(true);
        logInfo("CONFIRMATION EMAIL SENT TO", user.email);
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
