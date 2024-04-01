import prisma from "../../../shared/prisma";

const updateDoctor = async (id: string, payload: any) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  console.log(id, payload);

  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const DoctorService = {
  updateDoctor,
};
