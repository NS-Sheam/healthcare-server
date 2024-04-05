import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getMySchedules = async (param: any, options: IPaginationOptions, user: IAuthUser) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filteredData } = param;

  const andCondition: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: new Date(startDate),
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: new Date(endDate),
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filteredData).length > 0) {
    if (typeof filteredData.isBooked === "string" && filteredData.isBooked === "true") {
      filteredData.isBooked = true;
    } else if (typeof filteredData.isBooked === "string" && filteredData.isBooked === "false") {
      filteredData.isBooked = false;
    }
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: (filteredData as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.DoctorSchedulesWhereInput = { AND: andCondition };

  const result = await prisma.doctorSchedules.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
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

const deleteFromDB = async (user: IAuthUser, scheduleId: string) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const isBookedSchedule = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor.id,
        scheduleId,
      },
      isBooked: true,
    },
  });
  if (isBookedSchedule) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot delete booked schedule");
  }
  const result = await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctor.id,
        scheduleId,
      },
    },
  });
};

export const DoctorScheduleService = {
  insertIntoDB,
  getMySchedules,
  deleteFromDB,
};
