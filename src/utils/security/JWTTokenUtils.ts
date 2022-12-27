import * as jwt from "jsonwebtoken";
import { env } from "../../configs/env";
import { User } from "../../models/";
import {
  IllegalStateException,
  InvalidKeyException,
  NoResultException,
} from "../../models/exceptions";

export class TokenUtils {
  private accessTokenSecret = env.utils.JWT_TOKEN_SECRET || "";

  private doGenerateToken = async (
    userId: string,
    secret?: string
    // expiresAfter: number
  ) => {
    try {
      if (!secret) {
        throw new NoResultException();
      }
      return jwt.sign(userId, secret);
    } catch (e) {
      console.log(e);
      throw new IllegalStateException("Unable to generate Token");
    }
    // to allow expiration
    // return jwt.sign(userId, secret, { expiresIn: "24h" });
  };

  public generateAuthToken = (user: User) => {
    if (!user) {
      throw new NoResultException();
    }
    return this.doGenerateToken(user.userId, this.accessTokenSecret);
  };

  public verifyToken = async (token: string) => {
    try {
      return jwt.verify(token, this.accessTokenSecret) as string;
    } catch (e) {
      console.log(e);
      throw new InvalidKeyException("Invalid Token");
    }
  };
}
