import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = async (user: IAuthUser, payload: any) => {
  console.log(payload);

  const apointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });
  console.log(apointmentData);
};

export const PrescriptionService = {
  insertIntoDB,
};
