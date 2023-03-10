import * as bcrypt from "bcrypt";
import { logError } from "../../utils/Logger";
import { IllegalStateException } from "../../models/exceptions";

export const encode = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const res = await bcrypt.hash(password, salt);
    return res;
  } catch (e) {
    logError("Unable to Encode Password");
    throw new IllegalStateException("Unable to Encode Password");
  }
};

export const matches = async (
  enteredPassword: string,
  savedPassword: string
) => {
  try {
    const res = await bcrypt.compare(enteredPassword, savedPassword);
    return res;
  } catch (e) {
    throw new IllegalStateException("Unable to Verify Password");
  }
};
