import express from "express";
import { userController } from "./user.controller";
import { UserRole } from "@prisma/client";

import auth from "../../middlewares/auth";
const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.createAdmin);

export const userRoutes = router;
