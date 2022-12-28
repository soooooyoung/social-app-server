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
} from "routing-controllers";
import { PostService } from "../services/PostService";
import { BaseController } from "./BaseController";
import { BaseHeaderParam, Post as PostData } from "../models";

@Service()
@JsonController("/v1/posts")
export class PostController extends BaseController {
  @Inject()
  private postService: PostService = new PostService();

  /**
   * Get
   */
  @HttpCode(200)
  @Get("/:userId")
  public async getPosts(
    @Res() res: Response,
    @Param("userId") userId: string,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      let response: PostData[] = [];
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken) {
        const result = await this.postService.findAllPostsById(
          userId,
          authToken
        );
        if (result) {
          response = result;
          return res.status(200).json(response);
        }
      }

      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    } catch (e) {
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
  @Post("/")
  public async createPost(@Res() res: Response) {
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
  /**
   * Update
   */
  @HttpCode(200)
  @Post("/")
  public async updatePost(@Res() res: Response) {
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

  /**
   * Delete
   */
  @HttpCode(200)
  @Delete("/")
  public async deletePost(@Res() res: Response) {
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
