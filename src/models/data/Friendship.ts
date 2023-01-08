export interface Friendship {
  requesterId: string;
  addresseeId: string;
  statusCode: "A" | "B" | "D" | "R";
}
