import { qb } from "../../utils/KnexConnector";
import { Like, User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class LikeRepository extends DokiRepository<Like> {
  constructor() {
    super("post_like");
  }

  async delete(item: Partial<Like>): Promise<number> {
    return await qb(this.tableName).where(item).del();
  }

  async unionAll(
    item: Partial<Like>,
    alternative: Partial<Like>,
    sortBy?: keyof Like,
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
