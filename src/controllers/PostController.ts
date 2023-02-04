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
} from "routing-controllers";
import { PostService } from "../services/PostService";
import { BaseController } from "./BaseController";
import { BaseHeaderParam, Post as PostData } from "../models";
import { logError } from "../utils/Logger";

//TODO: change all parameters to object for safer transportation
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
    @Param("userId") userId: number,
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
  @Post("/:userId")
  public async createPost(
    @Res() res: Response,
    @Body() data: PostData,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken && data) {
        const result = await this.postService.savePost(userId, authToken, data);
        if (result) {
          return res.status(200).json(`${result} has Been Added`);
        }
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
   * Update
   */
  @HttpCode(200)
  @Patch("/:userId")
  public async updatePost(
    @Res() res: Response,
    @Body() data: PostData,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken && data) {
        const result = await this.postService.updatePost(
          userId,
          authToken,
          data
        );
        if (result) {
          return res.status(200).json("Updated Successfully");
        }
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
   * Delete
   */
  @HttpCode(200)
  @Delete("/:userId/:postId")
  public async deletePost(
    @Res() res: Response,
    @Param("postId") postId: number,
    @Param("userId") userId: number,
    @HeaderParams() header: BaseHeaderParam,
    @CookieParam("token") authToken: string
  ) {
    try {
      const auth = await this.checkAuth((key) => header[key]);

      if (auth && userId && authToken && postId) {
        const result = await this.postService.deletePostById(
          userId,
          authToken,
          postId
        );

        if (result) {
          return res.status(200).json(`${result} Has Been Added`);
        }
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
}
