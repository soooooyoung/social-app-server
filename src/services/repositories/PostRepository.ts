import { qb } from "../../utils/KnexConnector";
import { Post, User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class PostRepository extends DokiRepository<Post> {
  constructor() {
    super("posts");
  }

  async delete(userId: number, postId: number): Promise<number> {
    return await qb(this.tableName)
      .whereIn(["userId", "postId"], [[userId, postId]])
      .del();
  }

  async update(userId: number, postId: number, item: Post): Promise<boolean> {
    return await qb(this.tableName)
      .whereIn(["userId", "postId"], [[userId, postId]])
      .update(item);
  }

  async unionAll(
    item: Partial<Post>,
    alternative: Partial<Post>,
    sortBy?: keyof Post,
    direction?: "desc" | "asc"
  ) {
    if (sortBy) {
      return await qb(this.tableName)
        .where(item)
        .select("*")
        .unionAll([qb(this.tableName).select("*").where(alternative)])
        .orderBy(sortBy, direction ?? "desc");
    }

    return await qb(this.tableName)
      .where(item)
      .select("*")
      .unionAll([qb(this.tableName).select("*").where(alternative)]);
  }
}
