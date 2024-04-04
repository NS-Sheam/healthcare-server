import { Patient, Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IPatientFilterRequest } from "./patient.interface";
import { patientSearchableFields } from "./patient.const";

const getAllPatientFromDB = async (param: IPatientFilterRequest, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filteredData } = param;

  const andCondition: Prisma.PatientWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
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
  const whereCondition: Prisma.PatientWhereInput = { AND: andCondition };

  const result = await prisma.patient.findMany({
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
  });

  const total = await prisma.patient.count({
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
  const result = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updatePatient = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const updatedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });
    // create or update patient health data
    if (patientHealthData) {
      const healthData = await transactionClient.patientHealthData.upsert({
        where: {
          patientId: id,
        },
        update: patientHealthData,
        create: {
          ...patientHealthData,
          patientId: id,
        },
      });
    }
    // create or update medical report
    if (medicalReport) {
      const report = await transactionClient.medicalReport.create({
        data: {
          ...medicalReport,
          patientId: id,
        },
      });
    }
  });
  const responseResult = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return responseResult;
};

const deleteFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const patientDeletedData = await transactionClient.patient.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: patientDeletedData.email,
      },
    });
    return patientDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Patient | null> => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const patientDeletedData = await transactionClient.patient.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    return patientDeletedData;
  });
  return result;
};

export const PatientService = {
  getAllPatientFromDB,
  getByIdFromDB,
  updatePatient,
  deleteFromDB,
  softDeleteFromDB,
};
