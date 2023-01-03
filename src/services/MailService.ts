import { Service } from "typedi";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { encode } from "../utils/security/PasswordEncoder";
import { User } from "../models";
import { UserRepository } from "./repositories/UserRepository";

@Service()
export class MailService {
  public sendMail = (email: string) => {};
}
