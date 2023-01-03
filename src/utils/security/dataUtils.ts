import { User } from "../../models";

export const clearPrivateData = (user: User) => {
  user.password = undefined;
  return user;
};
