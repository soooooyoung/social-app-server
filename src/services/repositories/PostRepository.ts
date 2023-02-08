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

  async findAllPosts(
    item: Partial<Post>,
    sortBy?: keyof Post,
    direction?: "desc" | "asc"
  ) {
    if (sortBy) {
      return await qb(this.tableName)
        .where(item)
        .select()
        .orderBy(sortBy, direction ?? "desc")
        .count("likerId")
        .leftJoin("post_like", function () {
          this.on("post_like.postId", "=", "posts.postId").andOn(
            "post_like.postOwnerId",
            "=",
            "posts.userId"
          );
        });
    }
    return await qb(this.tableName)
      .where(item)
      .select()
      .count("likerId")
      .leftJoin("post_like", function () {
        this.on("post_like.postId", "=", "posts.postId").andOn(
          "post_like.postOwnerId",
          "=",
          "posts.userId"
        );
      });
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
        .count("likerId")
        .leftJoin("post_like", function () {
          this.on("post_like.postId", "=", "posts.postId").andOn(
            "post_like.postOwnerId",
            "=",
            "posts.userId"
          );
        })
        .orderBy(sortBy, direction ?? "desc");
    }

    return await qb(this.tableName)
      .where(item)
      .select("*")
      .unionAll([qb(this.tableName).select("*").where(alternative)])
      .count("likerId")
      .leftJoin("post_like", function () {
        this.on("post_like.postId", "=", "posts.postId").andOn(
          "post_like.postOwnerId",
          "=",
          "posts.userId"
        );
      });
  }
}
