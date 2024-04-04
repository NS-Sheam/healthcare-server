import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const insertSpecialtiesIntoDB = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialties.findMany();
  return result;
};

const getSpecialtyById = async (id: string) => {
  const result = await prisma.specialties.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteSpecialty = async (id: string) => {
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const SpecialtiesService = {
  insertSpecialtiesIntoDB,
  getAllSpecialties,
  getSpecialtyById,
  deleteSpecialty,
};
