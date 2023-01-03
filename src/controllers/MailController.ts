import { Response } from "express";
import { JsonController, HttpCode, Post, Res, Body } from "routing-controllers";
import { Inject, Service } from "typedi";
import { MailService } from "../services/MailService";
import { User } from "../models";

@Service()
@JsonController("/v1/mail")
export class MailController {
  @Inject()
  private mailService: MailService = new MailService();

  /**
   * Mail
   */
  @HttpCode(200)
  @Post("/send")
  public async signUp(@Res() res: Response) {
    try {
      return res.status(200).json({
        success: true,
        error: null,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
