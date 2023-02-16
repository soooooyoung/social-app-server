import { Post } from "models/data/Post";
import { BaseException } from "models/exceptions/BaseException";

export interface DokiResponse {
  success: boolean;
  error?: BaseException;
  result?: any;
}

export interface PostQueryResponse extends Post {
  post_like_postId?: number;
  likerId?: number;
}
