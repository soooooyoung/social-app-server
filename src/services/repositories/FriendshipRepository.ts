import { qb } from "../../utils/KnexConnector";
import { Friendship } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class FriendshipRepository extends DokiRepository<Friendship> {
  constructor() {
    super("friendship");
  }

  async update(
    requesterId: string,
    addresseeId: string,
    item: Friendship
  ): Promise<boolean> {
    return await qb(this.tableName)
      .whereIn(["requesterId", "addresseeId"], [[requesterId, addresseeId]])
      .update(item);
  }

  async delete(requesterId: string, addresseeId: string): Promise<number> {
    return await qb(this.tableName)
      .whereIn(["requesterId", "addresseeId"], [[requesterId, addresseeId]])
      .del();
  }

  async unionAll(userId: string, statusCode: Friendship["statusCode"]) {
    return await qb(this.tableName)
      .select("*")
      .where({ addresseeId: userId, statusCode })
      .unionAll([
        qb(this.tableName)
          .select("*")
          .where({ requesterId: userId, statusCode }),
      ]);
  }
}
