import { Service } from "typedi";
import * as mailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { IllegalStateException } from "../models/exceptions";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { env } from "../configs/env";
import { logError } from "../utils/Logger";
import { User } from "../models";

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

  public generateConfirmationCode = async (newUser: User) => {
    try {
      const user: User = {
        username: newUser.username,
        password: newUser.password,
        email: newUser.email,
      };
      const token = await this.tokenUtils.generateToken({ user }, 60 * 30);
      return { username: user.username, token };
    } catch (e) {
      logError(e);
      throw e;
    }
  };

  public sendMail = async (email: string, token: string, username?: string) => {
    try {
      const mail: MailOptions = {
        from: "SNSUS Support Team <support@snsus.click>",
        to: email,
        subject: "Confirm your SNSUS account",
        // text: `Click following link to finish signing up: ${client}/signup/verify_email/${token}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www. w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en-US">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>Confirm Your SNSUS Email</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="margin: 0; padding: 0; border: none; background: #faf9f8"
            width="100%"
          >
            <table
              role="presentation"
              align="center"
              cellpadding="0"
              cellspacing="0"
              width="613"
              style="
                border: 1px solid #cccccc;
                color: #4e5052;
                border-collapse: collapse;
                font-family: Nunito, Arial, Helvetica, sans-serif;
              "
            >
              <tr style="min-height: 200px; background: #ffffff; color: #7b7b7b">
                <td colspan="2" width="614"></td>
              </tr>
              <tr style="min-height: 200px; background: #ffffff; color: #7b7b7b">
                <td
                  colspan="2"
                  width="613"
                  style="
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    padding: 20px 15px;
                    border-bottom: 1px solid #7b7b7b;
                  "
                >
                  <p>Hello <span style="color: #ffb3c1">${username}</span></p>
                  <p>
                    You are receiving this message because you have requested a SNSUS
                    Account. To finish creating your SNSUS Account, click the button
                    below.<br /><br /><a
                      style="
                        text-decoration: none;
                        color: #ffffff;
                        padding: 0em 2em;
                        background-color: #ffb3c1;
                        width: 300px;
                        text-align: center;
                        border-radius: 8px;
                        font-size: 16px;
                      "
                      href="${client}/signup/verify_email/${token}"
                    
                    >
                      Click Here
                    </a>
                  </p>
                  <br /><br />
                </td>
              </tr>
              <tr
                width="613"
                style="background: #ffffff; color: #7b7b7b; font-size: 10px"
              >
                <td style="width: 70%; text-align: right; padding: 5px">
                  <div style="margin-right: 5px; margin-bottom: 2px">
                    Please do not reply directly to this email.
                  </div>
                  <div style="margin-right: 5px; margin-bottom: 2px">
                    Copyright © 2023 Shanabunny. All rights reserved.
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `,
      };

      await this.smtpTransport.sendMail(mail);
      this.smtpTransport.close();
    } catch (e) {
      this.smtpTransport.close();
      logError(e);
      throw new IllegalStateException("Unable to send email");
    }
  };
}
