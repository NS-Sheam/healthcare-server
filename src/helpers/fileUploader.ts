import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: "duuwqmunp",
  api_key: "567245281242557",
  api_secret: "GbuHLe8lepRSlXLwVW-wQaGbZyc",
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, { public_id: file.originalname }, (error, result) => {
      fs.unlinkSync(file.path);
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
