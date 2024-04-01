import prisma from "../../../shared/prisma";

const updateDoctor = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const updatedDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    for (const specialtyId of specialties) {
      const doctorSpecialties = await transactionClient.doctorSpecialties.create({
        data: {
          doctorId: id,
          specialitiesId: specialtyId,
        },
      });
    }
    return updatedDoctorData;
  });
  return result;
};

export const DoctorService = {
  updateDoctor,
};
