import { User } from "models";

export interface EmailJWT {
  iat?: number;
  exp?: number;
  user: User;
}
