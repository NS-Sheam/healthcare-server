import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      await getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      await getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      await getDoctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      await getPatientMetaData(user as IAuthUser);
      break;
    default:
      throw new Error("Invalid user role");
  }
};

export const MetaService = {
  fetchDashboardMetaData,
};

const getSuperAdminMetaData = async () => {
  console.log("Super Admin Meta Data");
};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });
};

const getDoctorMetaData = async (user: IAuthUser) => {
  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctor.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    where: {
      doctorId: doctor.id,
    },
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctor.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: {
      appointment: {
        doctorId: doctor.id,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const appointStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctor.id,
    },
  });

  const formattedAppointStatusDistribution = appointStatusDistribution.map(({ status, _count }) => ({
    status,
    count: Number(_count.id),
  }));

  console.dir(formattedAppointStatusDistribution, { depth: null });
};

const getPatientMetaData = async (user: IAuthUser) => {
  console.log("Patient Meta Data");
};
