import { qb } from "../../utils/KnexConnector";
import { DokiFile } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class FileRepository extends DokiRepository<DokiFile> {
  constructor() {
    super("file");
  }

  async delete(userId: number, fileId: number): Promise<number> {
    return await qb(this.tableName)
      .whereIn(["userId", "fileId"], [[userId, fileId]])
      .del();
  }
}
