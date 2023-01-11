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

  async findProfiles(params: UserQueryParams) {
    return clearPrivateData(
      await qb(this.tableName)
        .where(params)
        .select(["nickname, userId, username, email, profileImgUrl"])
    );
  }
  async update(userId: number, item: User): Promise<boolean> {
    return await qb(this.tableName).where({ userId }).update(item);
  }
}
