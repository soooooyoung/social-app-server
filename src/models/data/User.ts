export interface User {
  userId: string;
  username: string;
  password?: string;
  status: "ACTIVE" | "INACTIVE";
  created_date: string;
  nickname?: string;
  email: string;
}
