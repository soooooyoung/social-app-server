import * as jwt from "jsonwebtoken";
import { logError } from "../../utils/Logger";
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
    payload: string | object,
    secret?: string,
    expiresIn?: string | number
  ) => {
    try {
      if (!secret) {
        throw new NoResultException();
      }
      if (expiresIn) {
        return jwt.sign(payload, secret, { expiresIn: expiresIn });
      }
      return jwt.sign(payload, secret);
    } catch (e) {
      logError(e);
      throw new IllegalStateException("Unable to generate Token");
    }
  };

  public generateAuthToken = (user: User, expiresIn?: string | number) => {
    if (!user || !user.userId) {
      logError("NO USER IN GENERATE AUTH TOKEN");
      throw new NoResultException();
    }
    return this.doGenerateToken(user.userId, this.accessTokenSecret, expiresIn);
  };

  public generateToken = (
    payload: string | object,
    expiresIn?: string | number
  ) => {
    if (!payload) {
      logError("NO PAYLOAD IN GENERATE TOKEN");
      throw new NoResultException();
    }
    return this.doGenerateToken(payload, this.accessTokenSecret, expiresIn);
  };

  public verifyToken = async (token: string) => {
    try {
      return jwt.verify(token, this.accessTokenSecret) as string;
    } catch (e) {
      logError(e);
      throw new InvalidKeyException("Invalid Token");
    }
  };
}
