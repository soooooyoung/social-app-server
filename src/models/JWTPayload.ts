import { User } from "models";

export interface JWTPayload {
  iat?: number;
  exp?: number;
}
export interface EmailJWT extends JWTPayload {
  user: User;
}

export interface AuthTokenJWT extends JWTPayload {
  user: User;
}

export interface FileTokenJWT extends JWTPayload {
  file: {
    filePath: string;
    fileId: number;
  };
}
