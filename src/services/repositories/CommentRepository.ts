import { k, qb } from "../../utils/KnexConnector";
import { Comment } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class CommentRepository extends DokiRepository<Comment> {
  constructor() {
    super("comment");
  }

  async findAllComments(
    item: Partial<Comment>,
    sortBy?: keyof Comment,
    direction?: "desc" | "asc"
  ) {
    if (sortBy) {
      return await qb(this.tableName)
        .where(item)
        .select()
        .orderBy(sortBy, direction ?? "desc")
        .leftJoin(
          qb("users")
            .select(
              k().raw("userId as ??", ["user_userId"]),
              "profileImgUrl",
              "username",
              "nickname"
            )
            .whereNotNull("userId")
            .as("x"),
          "comment.userId",
          "x.user_userId"
        );
    }
    return await qb(this.tableName)
      .where(item)
      .select()
      .leftJoin(
        qb("users")
          .select(
            k().raw("userId as ??", ["user_userId"]),
            "profileImgUrl",
            "username",
            "nickname"
          )
          .whereNotNull("userId")
          .as("x"),
        "comment.userId",
        "x.user_userId"
      );
  }

  async delete(item: Partial<Comment>): Promise<number> {
    return await qb(this.tableName).where(item).del();
  }

  async unionAll(
    item: Partial<Comment>,
    alternative: Partial<Comment>,
    sortBy?: keyof Comment,
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
