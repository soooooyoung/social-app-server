export interface Auth {
  svcId: string; // PK
  svc: string;
  admin: boolean;
  expired: boolean;
  expires: Date;
}
