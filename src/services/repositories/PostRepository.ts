import { k, qb } from "../../utils/KnexConnector";
import { Post, User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class PostRepository extends DokiRepository<Post> {
  constructor() {
    super("posts");
  }

  private selectPost = [
    "post.postId",
    "post.userId",
    "post.content",
    "post.created_date",
    "post.updated_date",
    "post.statusCode",
  ];

  async delete(userId: number, postId: number): Promise<number> {
    await qb("post_like").where({ postId }).del();
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
        .leftJoin(
          qb("post_like")
            .select(k().raw("postId as ??", ["post_like_postId"]), "likerId")
            .whereNotNull("postId")
            .as("x"),
          "posts.postId",
          "x.post_like_postId"
        );
    }
    return await qb(this.tableName)
      .where(item)
      .select()
      .leftJoin(
        qb("post_like")
          .select(k().raw("postId as ??", ["post_like_postId"]), "likerId")
          .whereNotNull("postId")
          .as("x"),
        "x.post_like_postId",
        "posts.postId"
      );
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
        .select()
        .leftJoin(
          qb("post_like")
            .select(k().raw("postId as ??", ["post_like_postId"]), "likerId")
            .whereNotNull("postId")
            .as("x"),
          "x.post_like_postId",
          "posts.postId"
        )
        .unionAll([
          qb(this.tableName)
            .select("*")
            .where(alternative)
            .leftJoin(
              qb("post_like")
                .select(
                  k().raw("postId as ??", ["post_like_postId"]),
                  "likerId"
                )
                .whereNotNull("postId")
                .as("x"),
              "x.post_like_postId",
              "posts.postId"
            ),
        ])
        .orderBy(sortBy, direction ?? "desc");
    }

    return await qb(this.tableName)
      .where(item)
      .select()
      .leftJoin(
        qb("post_like")
          .select(k().raw("postId as ??", ["post_like_postId"]), "likerId")
          .whereNotNull("postId")
          .as("x"),
        "x.post_like_postId",
        "posts.postId"
      )
      .unionAll([
        qb(this.tableName)
          .select("*")
          .where(alternative)
          .leftJoin(
            qb("post_like")
              .select(k().raw("postId as ??", ["post_like_postId"]), "likerId")
              .whereNotNull("postId")
              .as("x"),
            "x.post_like_postId",
            "posts.postId"
          ),
      ]);
  }
}
