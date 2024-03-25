import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
const createAdmin = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = fileUploader.uploadToCloudinary(file);
  }

  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  // const userData = {
  //   email: data.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };

  // const adminData = {
  //   name: data.admin.name,
  //   email: data.admin.email,
  // };

  // const result = await prisma.$transaction(async (transactionClient) => {
  //   await transactionClient.user.create({
  //     data: userData,
  //   });
  //   const createdAdminData = await transactionClient.admin.create({
  //     data: data.admin,
  //   });
  //   return createdAdminData;
  // });
  // return result;
};

export const userService = {
  createAdmin,
};
