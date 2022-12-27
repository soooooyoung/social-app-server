import { User } from "../../models";
import { DokiRepository } from "./DokiRepository";

export class UserRepository extends DokiRepository<User> {
  constructor() {
    super("users");
  }
}
