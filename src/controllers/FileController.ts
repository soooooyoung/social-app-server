import { Response } from "express";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  Body,
  Param,
  HeaderParams,
  CookieParam,
  UploadedFile,
} from "routing-controllers";
import * as Express from "express";
import { Inject, Service } from "typedi";
import { FileService } from "../services/FileService";
import { BaseHeaderParam, User } from "../models";
import { BaseController } from "./BaseController";
import { ResponseUtils } from "../utils/ResponseUtils";
import { logError, logInfo } from "../utils/Logger";

@Service()
@JsonController("/v1/file")
export class FileController extends BaseController {
  @Inject()
  private fileService: FileService = new FileService();

  /**
   * CREATE with User
   */
  @HttpCode(200)
  @Post("/user/:userId")
  public async sendSignupEmail(
    @Res() res: Response,
    @Param("userId") userId: number,
    @UploadedFile("file") file: any
    // @HeaderParams() header: BaseHeaderParam
    // @CookieParam("token") authToken: string
  ) {
    try {
      console.log(1);
      console.log(file);
      // const auth = await this.checkAuth((key) => header[key]);
      const response = new ResponseUtils();
      // if (auth && userId !== undefined) {
      //   console.log(2);
      // }
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
