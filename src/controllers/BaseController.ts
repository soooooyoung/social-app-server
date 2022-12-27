import { Response } from "express";
import { BaseHeaderParam } from "../models";
import { JsonController } from "routing-controllers";
import { AuthRepository } from "../services/repositories";
import { Service } from "typedi";
import { APIKeyUtils } from "../utils/security/APIKeyUtils";

@Service()
@JsonController()
export class BaseController {
  private apiKeyUtils: APIKeyUtils = new APIKeyUtils();
  private authRepository: AuthRepository = new AuthRepository();

  protected checkAuth = async (
    getKey: (keyName: keyof BaseHeaderParam) => string
  ) => {
    const key = this.apiKeyUtils.parseFromKey(getKey("apikey"));

    if (key) {
      const svc = await this.authRepository.findById({ svcId: key });
      return !svc.expired;
    }

    return false;
  };
}
