import { Service } from "typedi";
import * as mailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { env } from "../configs/env";

const { email, client } = env;
@Service()
export class MailService {
  constructor() {
    this.smtpTransport = mailer.createTransport({
      host: email.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: email.EMAIL_AUTH_USER,
        pass: email.EMAIL_AUTH_PASS,
      },
    });
  }
  private smtpTransport: mailer.Transporter;
  private tokenUtils: TokenUtils = new TokenUtils();

  public generateConfirmationCode = async (email: string) => {
    try {
      const token = await this.tokenUtils.generateToken({ email }, 60 * 30);
      return token;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  public sendMail = async (email: string, token: string) => {
    try {
      const mail: MailOptions = {
        from: "SNSUS Support Team <support@snsus.click>",
        to: email,
        subject: "Confirm your SNSUS account",
        text: `${client}/signup/verify_email=${token}`,
      };

      await this.smtpTransport.sendMail(mail);
      this.smtpTransport.close();
    } catch (e) {
      this.smtpTransport.close();
      console.log(e);
      throw new IllegalStateException("Unable to send email");
    }
  };
}
