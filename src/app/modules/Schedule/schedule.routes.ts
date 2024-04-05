import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get("/", auth(UserRole.DOCTOR), ScheduleController.getAllSchedules);
router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.insertScheduleIntoDB);

export const ScheduleRoutes = router;
