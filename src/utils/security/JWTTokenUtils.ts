import { env } from "../../configs/env";
import jwt from "jsonwebtoken";
import { User } from "../../models/";
import { NoResultException } from "../../models/exceptions/NoResultException";

export class TokenUtils {
  private accessTokenSecret = env.utils.JWT_TOKEN_SECRET;

  private doGenerateToken(
    userId: string,
    secret?: string
    // expiresAfter: number
  ) {
    if (!secret) {
      throw new NoResultException();
    }
    // to allow expiration
    // return jwt.sign(userId, secret, { expiresIn: "24h" });
    return jwt.sign(userId, secret);
  }

  public generateAuthToken(user: User) {
    if (!user) {
      throw new NoResultException();
    }
    return this.doGenerateToken(user.user_Id, this.accessTokenSecret);
  }
}
