import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });
  if (patientData.id !== appointmentData.patientId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized to create review for this appointment");
  }

  const result = await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: patientData.id,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      patient: true,
      doctor: true,
    },
  });
  return result;
};

export const ReviewService = {
  insertIntoDB,
};
