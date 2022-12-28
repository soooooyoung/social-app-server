import { qb } from "../../utils/KnexConnector";
import { Post, User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class PostRepository extends DokiRepository<Post> {
  constructor() {
    super("posts");
  }

  async delete(
    userId: User["userId"],
    postId: Post["postId"]
  ): Promise<number> {
    return await qb(this.tableName)
      .whereIn(["userId", "postId"], [[userId, postId]])
      .del();
  }
}
