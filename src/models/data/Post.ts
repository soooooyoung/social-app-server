export interface Post {
  postId: number;
  userId: number;
  created_date: string;
  updated_date?: string;
  content?: string;
  statusCode?: "P" | "G" | "B" | "F";
}
