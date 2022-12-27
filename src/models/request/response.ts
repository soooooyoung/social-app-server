import { BaseException } from "models/exceptions/BaseException";

export interface DokiResponse {
  success: boolean;
  error?: BaseException;
  result?: any;
}
