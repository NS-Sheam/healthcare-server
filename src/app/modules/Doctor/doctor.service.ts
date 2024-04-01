import prisma from "../../../shared/prisma";

const updateDoctor = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  await prisma.$transaction(async (transactionClient) => {
    const updatedDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specialties

      const deleteSpecialtiesIds = specialties.filter((speciality) => speciality.isDeleted);

      for (const speciality of deleteSpecialtiesIds) {
        const deletes = await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: speciality.specialtiesId,
          },
        });
      }

      // add specialties
      const createSpecialtiesIds = specialties.filter((speciality) => !speciality.isDeleted);

      for (const speciality of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: speciality.specialtiesId,
          },
        });
      }
    }

    return updatedDoctorData;
  });
  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

export const DoctorService = {
  updateDoctor,
};
