import { qb } from "../../utils/KnexConnector";
import { Post, User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class PostRepository extends DokiRepository<Post> {
  constructor() {
    super("posts");
  }

  async delete(userId: string, postId: string): Promise<number> {
    return await qb(this.tableName)
      .whereIn(["userId", "postId"], [[userId, postId]])
      .del();
  }

  async update(userId: string, postId: string, item: Post): Promise<boolean> {
    return await qb(this.tableName)
      .whereIn(["userId", "postId"], [[userId, postId]])
      .update(item);
  }
}
