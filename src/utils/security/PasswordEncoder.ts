import * as bcrypt from "bcrypt";

export const encode = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const res = await bcrypt.hash(password, salt);
    return res;
  } catch (e) {
    return console.log(e);
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
    return console.log(e);
  }
};
