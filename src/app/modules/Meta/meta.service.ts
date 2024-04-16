import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      await getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      await getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      await getDoctorMetaData();
      break;
    case UserRole.PATIENT:
      await getPatientMetaData();
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
  console.log("Admin Meta Data");
};

const getDoctorMetaData = async () => {
  console.log("Doctor Meta Data");
};

const getPatientMetaData = async () => {
  console.log("Patient Meta Data");
};
