import { Response } from "express";
import { JsonController, HttpCode, Post, Res } from "routing-controllers";
import { Inject, Service } from "typedi";
import { UserService } from "../services/UserService";

@Service()
@JsonController("/auth")
export class AuthController {
  @Inject()
  private userService: UserService = new UserService();

  /**
   * SIGNUP
   */
  @HttpCode(200)
  @Post("/up")
  public async signUp(@Res() res: Response) {
    try {
      await this.userService.signUpUser();
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
