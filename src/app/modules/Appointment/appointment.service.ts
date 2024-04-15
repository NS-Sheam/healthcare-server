import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
const createAppointment = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId: string = uuidv4();

  const result = prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // Healthcare-datetime
    const today = new Date();
    const transactionId =
      "Healthcare" +
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDay() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });
  return result;
};

const getMyAppointment = async (user: IAuthUser, filters: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { ...filteredData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filteredData).length > 0) {
    const filterConditions = Object.keys(filteredData).map((key) => ({
      [key]: {
        equals: (filteredData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
    const whereCondition: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
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
      include:
        user?.role === UserRole.PATIENT
          ? { doctor: true, schedule: true }
          : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true },
    });

    const total = await prisma.appointment.count({
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
  }
};
const changeAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, user: IAuthUser) => {
  const appointData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR && appointData.doctor.email !== user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized to change this appointment status");
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointData.id,
    },
    data: {
      status,
    },
  });
  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      paymentStatus: PaymentStatus.UNPAID,
      createdAt: {
        lte: thirtyMinAgo,
      },
    },
  });
  const appointmentIdsToCancel = unpaidAppointments.map((appointment) => appointment.id);

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });
    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });
    await tx.doctorSchedules.updateMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
      data: {
        isBooked: false,
      },
    });
    for (const unpaidAppointment of unpaidAppointments) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unpaidAppointment.doctorId,
          scheduleId: unpaidAppointment.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
