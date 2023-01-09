import {
  IsNumberString,
  Length,
  IsNotEmpty,
  isNotEmpty,
} from "class-validator";
import { Friendship } from "../../models/data/Friendship";

export class BaseHeaderParam {
  @IsNotEmpty()
  public "apikey": string;
}
export class BaseBodyParam {}

export class LoginParam extends BaseBodyParam {
  @IsNotEmpty()
  public username?: string;
  @IsNotEmpty()
  public password?: string;
}

export class AuthTokenParam extends BaseBodyParam {
  @IsNotEmpty()
  public authToken?: string;
}

export class SignupParam {
  @IsNotEmpty()
  public username?: string;
  @IsNotEmpty()
  public password?: string;
  @IsNotEmpty()
  public type?: string;
  @IsNotEmpty()
  public email?: string;
}

export class SignupEmailLinkParam extends SignupParam {
  @IsNotEmpty()
  public token?: string;
}

export class FriendshipParam {
  @IsNotEmpty()
  public requesterId?: number;
  @IsNotEmpty()
  public addresseeId?: number;
}

export class UserQueryParams {
  public userId?: number;
  public username?: string;
  public nickname?: string;
  public email?: string;
  public statusCode?: string;
  public typeCode?: string;
}
