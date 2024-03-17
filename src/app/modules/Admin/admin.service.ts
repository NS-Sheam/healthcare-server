import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdminFromDB = async (params: any) => {
  const andCondition: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];
  if (params?.searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
