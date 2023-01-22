import { qb } from "../../utils/KnexConnector";
import { DokiFile } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class FileRepository extends DokiRepository<DokiFile> {
  constructor() {
    super("file");
  }

  async delete(id: Partial<DokiFile>): Promise<number> {
    return await qb(this.tableName).where(id).del();
  }
}
