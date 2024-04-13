import config from "../../../config";
import axios from "axios";
import prisma from "../../../shared/prisma";
import { SSLService } from "../SSL/ssl.service";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  const initPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };
  const result = await SSLService.initPayment(initPaymentData);
  console.log(result.GatewayPageURL);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

export const PaymentService = {
  initPayment,
};
