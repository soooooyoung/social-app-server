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
} from "routing-controllers";
import { CommentService } from "../services/CommentService";
import { BaseController } from "./BaseController";
import { BaseHeaderParam, Comment } from "../models";
import { logError } from "../utils/Logger";

@Service()
@JsonController("/v1/comment")
export class PostController extends BaseController {
  @Inject()
  private commentService: CommentService = new CommentService();
  /**
   * Get
   */
  @HttpCode(200)
  @Get("/:postId")
  public async getPosts(
    @Res() res: Response,
    @Param("postId") postId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken) {
        const result = await this.commentService.getAllComments(
          authToken,
          postId
        );
        return res.status(200).json(result);
      }

      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
      logError(e);
      return res.status(400).json({
        success: false,
        error: e,
      });
    }
  }
  /**
   * Create
   */
  @HttpCode(200)
  @Post("/:postId")
  public async createComment(
    @Res() res: Response,
    @Body() body: Comment,
    @Param("postId") postId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && authToken && postId) {
        const comment: Comment = {
          postId,
          content: body.content,
        };
        await this.commentService.saveComment(authToken, comment);
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
  @Delete("/:postId/:userId/:commentId")
  public async deleteComment(
    @Res() res: Response,
    @Param("postId") postId: number,
    @Param("userId") userId: number,
    @Param("commentId") commentId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && postId && commentId && userId && authToken) {
        const comment: Comment = { postId, userId, commentId };
        await this.commentService.deleteComment(authToken, comment);
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
