import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchableFields } from "./admin.const";

const prisma = new PrismaClient();

const clculatePagination = (options: { page?: string; limit?: string; sortBy?: string; sortOrder?: string }) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";
  return { page, limit, skip, sortBy, sortOrder };
};

const getAllAdminFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = clculatePagination(options);
  const { searchTerm, ...filteredData } = params;

  const andCondition: Prisma.AdminWhereInput[] = [];
  if (searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filteredData).length > 0) {
    andCondition.push({
      AND: Object.keys(filteredData).map((key) => ({
        [key]: {
          equals: filteredData[key],
        },
      })),
    });
  }
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  return result;
};

export const AdminService = {
  getAllAdminFromDB,
};
