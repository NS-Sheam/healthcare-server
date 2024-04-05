import prisma from "../../../shared/prisma";

const insertIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });
  console.log(payload);
};

export const DoctorScheduleService = {
  insertIntoDB,
};
