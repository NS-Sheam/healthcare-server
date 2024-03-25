import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import config from "../config";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
cloudinary.config({
  cloud_name: config.fileUploader.cloudinary_cloud_name,
  api_key: config.fileUploader.cloudinary_api_key,
  api_secret: config.fileUploader.cloudinary_api_secret,
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

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
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
