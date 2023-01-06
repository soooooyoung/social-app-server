export interface User {
  userId?: string;
  username?: string;
  password?: string;
  status?: "ACTIVE" | "INACTIVE";
  type?: "EMAIL" | "KAKAO" | "NAVER" | "GOOGLE";
  created_date?: string;
  nickname?: string;
  email?: string;
}
