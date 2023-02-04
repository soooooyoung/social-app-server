import { qb } from "../../utils/KnexConnector";
import { Friendship } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class FriendshipRepository extends DokiRepository<Friendship> {
  constructor() {
    super("friendship");
  }

  async findFriendShip(
    userId: number,
    friendId: number,
    statusCode: Friendship["statusCode"]
  ) {
    return await qb(this.tableName)
      .where({ requesterId: userId, addresseeId: friendId, statusCode })
      .orWhere({ requesterId: friendId, addresseeId: userId, statusCode })
      .select("*");
  }

  async saveOrUpdate(item: Friendship): Promise<any> {
    const [output] = await qb(this.tableName)
      .insert<Friendship>(item)
      .onConflict(["requesterId", "addresseeId"])
      .merge()
      .returning("*");

    return output;
  }
  async update(
    requesterId: number,
    addresseeId: number,
    item: Friendship
  ): Promise<boolean> {
    return await qb(this.tableName)
      .whereIn(["requesterId", "addresseeId"], [[requesterId, addresseeId]])
      .update(item);
  }

  async delete(userId: number, friendId: number): Promise<number> {
    return await qb(this.tableName)
      .whereIn(
        ["requesterId", "addresseeId"],
        [
          [userId, friendId],
          [friendId, userId],
        ]
      )
      .del();
  }

  async unionAll(userId: number) {
    return await qb(this.tableName)
      .select("*")
      .where({ addresseeId: userId })
      .unionAll([
        qb(this.tableName).select("*").where({ requesterId: userId }),
      ]);
  }
  async unionAllFriends(userId: number, statusCode: Friendship["statusCode"]) {
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
