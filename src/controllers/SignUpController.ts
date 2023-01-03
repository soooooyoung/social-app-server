import { Response } from "express";
import { JsonController, HttpCode, Post, Res, Body } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";
import { User } from "../models";

@Service()
@JsonController("/v1/signup")
export class SignUpController {
  @Inject()
  private userService: UserService = new UserService();

  /**
   * SIGNUP
   */
  @HttpCode(200)
  @Post("")
  public async signUp(@Res() res: Response, @Body() user: User) {
    try {
      const response = await this.userService.signUpUser(user);

      console.log("SIGN UP RESULT:", response);
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
