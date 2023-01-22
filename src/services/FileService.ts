import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import { promisify } from "util";
import { Service } from "typedi";
import { AuthTokenJWT } from "../models";
import { logError } from "../utils/Logger";
import { TokenUtils } from "../utils/security/JWTTokenUtils";
import { FileRepository } from "./repositories/FileRepostory";
import { UserRepository } from "./repositories/UserRepository";
import { env } from "../configs/env";
import { FileTokenJWT } from "../models/JWTPayload";

@Service()
export class FileService {
  private fileRepository: FileRepository = new FileRepository();
  private userRepository: UserRepository = new UserRepository();
  private tokenUtils: TokenUtils = new TokenUtils();

  public checkUserPermission = async (userId: number, authToken: string) => {
    try {
      const result = await this.tokenUtils.verifyToken<AuthTokenJWT>(authToken);
      if (result.user && result.user.userId === userId) {
        return true;
      }
      return false;
    } catch (e) {
      logError("INVALID PERMISSION:", e);
      throw e;
    }
  };

  public saveFileToUser = async (userId: number, filepath?: string) => {
    try {
      if (!filepath) {
        throw new Error("Invalid File Path");
      }
      const newPath = path.resolve(`${env.path.userImg}/${userId}.png`);
      await fs.copyFileSync(path.resolve(filepath), newPath);
      const profileImgId = (await this.fileRepository.save({
        path: newPath,
        userId,
      })) as number;

      const file = {
        fileId: profileImgId,
        filePath: newPath,
      };
      const token = await this.tokenUtils.generateToken({
        file,
      });
      const profileImgUrl = `/file?token=${token}`;
      await this.userRepository.update(userId, { profileImgUrl });
    } catch (e) {
      logError("IMG SAVE FAILED: ", e);
      throw e;
    }
  };

  public deleteFileFromUser = async (userId: number) => {
    try {
      await this.fileRepository.delete({ userId });
      await this.userRepository.update(userId, {
        profileImgUrl: null,
      });
    } catch (e) {
      logError("IMG DELETE FAILED: ", e);
      throw e;
    }
  };

  // public getProfileUrlForUser = async (userId: number) => {
  //   try {
  //     if (!userId) {
  //       throw new Error("UserId required");
  //     }
  //     const user = await this.userRepository.findById({ userId });
  //     if (user && user.profileImgId) {
  //       const filePath = await this.fileRepository
  //         .findById({
  //           fileId: user.profileImgId,
  //         })
  //         .then((data) => data?.path);
  //       if (filePath) {
  //         const file = {
  //           fileId: user.profileImgId,
  //           filePath,
  //         };
  //         const token = await this.tokenUtils.generateToken({
  //           file,
  //         });
  //         const url = `/file?token=${token}`;
  //         return url;
  //       }
  //     }
  //   } catch (e) {
  //     logError("IMG GET FAILED: ", e);
  //   }
  // };

  public getFileFromUrl = async (res: Response, token: string) => {
    const { file } = await this.tokenUtils.verifyToken<FileTokenJWT>(token);
    if (file) {
      await promisify<string, void>(res.download.bind(res))(file.filePath);
    }
  };
}
