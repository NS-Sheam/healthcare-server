import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);
  const accessToken = jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "secret",
    {
      algorithm: "HS256",
      expiresIn: "1d",
    }
  );
  console.log("accessToken", accessToken);
};

export const AuthServices = {
  loginUser,
};
