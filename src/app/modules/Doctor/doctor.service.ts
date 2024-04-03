import { Doctor, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IDoctorFilterRequest } from "./doctor.interface";
import { doctorSearchableFields } from "./doctor.const";

const getAllDoctorFromDB = async (param: IDoctorFilterRequest, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filteredData } = param;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (specialties && specialties.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }
  andCondition.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.DoctorWhereInput = { AND: andCondition };

  const result = await prisma.doctor.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string) => {
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateDoctor = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specialties

      const deleteSpecialtiesIds = specialties.filter((speciality) => speciality.isDeleted);

      for (const speciality of deleteSpecialtiesIds) {
        const deletes = await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: speciality.specialtiesId,
          },
        });
      }

      // add specialties
      const createSpecialtiesIds = specialties.filter((speciality) => !speciality.isDeleted);

      for (const speciality of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: speciality.specialtiesId,
          },
        });
      }
    }

    return updatedDoctorData;
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });
    return doctorDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Doctor | null> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return doctorDeletedData;
  });
  return result;
};

export const DoctorService = {
  getAllDoctorFromDB,
  getByIdFromDB,
  updateDoctor,
  deleteFromDB,
  softDeleteFromDB,
};
