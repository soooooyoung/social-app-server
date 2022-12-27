import { Auth } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class AuthRepository extends DokiRepository<Auth> {
  constructor() {
    super("auth");
  }
}
