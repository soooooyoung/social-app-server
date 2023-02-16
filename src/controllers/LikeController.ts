import { Response } from "express";
import { Inject, Service } from "typedi";
import {
  JsonController,
  HttpCode,
  Get,
  Res,
  Post,
  Delete,
  HeaderParams,
  Param,
  CookieParam,
  Body,
  Patch,
  QueryParam,
} from "routing-controllers";
import { LikeService } from "../services/LikeService";
import { BaseController } from "./BaseController";
import { BaseHeaderParam, Like } from "../models";
import { logError } from "../utils/Logger";

//TODO: change all parameters to object for safer transportation
@Service()
@JsonController("/v1/like")
export class PostController extends BaseController {
  @Inject()
  private likeService: LikeService = new LikeService();

  /**
   * Create
   */
  @HttpCode(200)
  @Post("/:userId")
  public async createLike(
    @Res() res: Response,
    @Body() { postId }: { postId: number },
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken && postId) {
        const like: Like = { likerId: userId, postId };
        await this.likeService.saveLike(authToken, like);
        return res.status(200).json({
          success: true,
        });
      }
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }

  /**
   * Delete
   */
  @HttpCode(200)
  @Delete("/:userId/:postId")
  public async deleteLike(
    @Res() res: Response,
    @Param("postId") postId: number,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken && postId) {
        const like: Like = { likerId: userId, postId };
        await this.likeService.deleteLike(authToken, like);
        return res.status(200).json({
          success: true,
        });
      }
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
}
