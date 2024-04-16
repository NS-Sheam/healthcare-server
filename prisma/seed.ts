import { UserRole } from "@prisma/client";
import prisma from "../src/shared/prisma";
import bcrypt from "bcrypt";
const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (isSuperAdminExist) return;
    const hashedPassword: string = await bcrypt.hash("superAdmin", 12);
    await prisma.user.create({
      data: {
        email: "cardik360degree@gmail.com",
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "1234567890",
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
