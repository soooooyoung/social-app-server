import * as multer from "multer";

export const fileUploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, "tmp");
    },
    filename: function (req: any, file: any, cb: any) {
      const filename = file.originalname.replace(" ", "-");
      cb(null, `${filename}`);
    },
  }),
  //   fileFilter: (req: any, file: any, cb: any) => {},
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * 2,
  },
};
