export interface Friendship {
  requesterId: number;
  addresseeId: number;
  statusCode: "A" | "B" | "D" | "R";
}
