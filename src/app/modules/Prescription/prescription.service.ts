import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (user: IAuthUser, payload: Partial<Prescription>) => {
  console.log(payload);

  const apointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });
  if (user?.email !== apointmentData.doctor.email) {
    throw new Error("You are not authorized to create prescription for this appointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: apointmentData.id,
      doctorId: apointmentData.doctorId,
      patientId: apointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

export const PrescriptionService = {
  insertIntoDB,
};
