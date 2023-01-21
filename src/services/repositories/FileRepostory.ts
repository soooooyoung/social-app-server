import { DokiFile } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class FileRepository extends DokiRepository<DokiFile> {
  constructor() {
    super("file");
  }
}
