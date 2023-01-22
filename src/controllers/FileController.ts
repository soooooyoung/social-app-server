import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import {
  JsonController,
  HttpCode,
  Post,
  Res,
  Param,
  HeaderParams,
  CookieParam,
  UploadedFile,
  Get,
  QueryParam,
  Delete,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { FileService } from "../services/FileService";
import { BaseHeaderParam } from "../models";
import { BaseController } from "./BaseController";
import { ResponseUtils } from "../utils/ResponseUtils";
import { logError } from "../utils/Logger";
import { fileUploadOptions } from "../configs/MulterConfig";

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
  public async saveUserProfileImg(
    @Res() res: Response,
    @Param("userId") userId: number,
    @UploadedFile("file", {
      options: fileUploadOptions,
    })
    file: any,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);
      const response = new ResponseUtils();
      if (auth && userId && authToken) {
        const userPermission = await this.fileService.checkUserPermission(
          userId,
          authToken
        );
        if (userPermission) {
          await this.fileService.saveFileToUser(userId, file.path);
          response.validate(true);
        }
        await fs.unlinkSync(path.resolve(file.path));
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

  /**
   * DELETE with User
   */
  @HttpCode(200)
  @Delete("/user/:userId")
  public async deleteUserProfileImg(
    @Res() res: Response,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);
      const response = new ResponseUtils();
      if (auth && userId && authToken) {
        const userPermission = await this.fileService.checkUserPermission(
          userId,
          authToken
        );
        if (userPermission) {
          await this.fileService.deleteFileFromUser(userId);
          response.validate(true);
        }
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

  // NOTE: this is extra step for creating url that expires.
  /**
   * Get File URL
   */
  // @HttpCode(200)
  // @Get("/user/:userId")
  // public async getUserProfileUrl(
  //   @Res() res: Response,
  //   @Param("userId") userId: number,
  //   @HeaderParams() header: BaseHeaderParam,
  //   @CookieParam("token") authToken: string
  // ) {
  //   try {
  //     const auth = await this.checkAuth((key) => header[key]);
  //     const response = new ResponseUtils();
  //     if (auth && userId && authToken) {
  //       const url = await this.fileService.getProfileUrlForUser(userId);
  //       if (url) {
  //         return res.status(200).json(url);
  //       }
  //     }

  //     return res.status(401).json(response);
  //   } catch (e) {
  //     logError(e);
  //     return res.status(400).json({
  //       success: false,
  //       error: e,
  //     });
  //   }
  // }

  /**
   * Get File
   */
  @HttpCode(200)
  @Get("")
  public async getFileByToken(
    @Res() res: Response,
    @QueryParam("token") token: string
  ) {
    try {
      await this.fileService.getFileFromUrl(res, token);
      return res.status(200);
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
