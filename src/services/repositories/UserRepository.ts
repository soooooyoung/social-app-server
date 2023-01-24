import { qb } from "../../utils/KnexConnector";
import { clearPrivateData } from "../../utils/security/dataUtils";
import { User, UserQueryParams } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class UserRepository extends DokiRepository<User> {
  constructor() {
    super("users");
  }

  async findUsers(key: string, array: Array<any>, select?: any) {
    return clearPrivateData(
      await qb(this.tableName).whereIn(key, array).select(select)
    );
  }

  async findUsersByKeyword(userId: number, keyword: string) {
    const search = `%${keyword}%`;
    return await qb(this.tableName)
      .whereNot({ userId })
      .andWhereILike("username", search)
      .orWhereILike("nickname", keyword)
      .leftJoin("friendship", function () {
        this.on(function () {
          this.on("users.userId", "=", "friendship.requesterId").onIn(
            "friendship.addresseeId",
            [userId]
          );
        }).orOn(function () {
          this.on("users.userId", "=", "friendship.addresseeId").onIn(
            "friendship.requesterId",
            [userId]
          );
        });
      });
  }

  async update(userId: number, item: User): Promise<boolean> {
    return await qb(this.tableName).where({ userId }).update(item);
  }
}
