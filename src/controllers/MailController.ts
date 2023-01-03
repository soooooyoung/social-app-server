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
import { BaseHeaderParam } from "../models";
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
  @Post("/send/:email")
  public async signUp(
    @Res() res: Response,
    @HeaderParams() header: BaseHeaderParam,
    @Param("email") email: string
  ) {
    try {
      const response = new ResponseUtils();
      const auth = await this.checkAuth((key) => header[key]);
      if (auth && email !== undefined) {
        const token = await this.mailService.generateConfirmationCode(email);
        await this.mailService.sendMail(email, token);
        response.put("sent", email);
        response.validate(true);
        logInfo("CONFIRMATION EMAIL SENT TO", email);
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
