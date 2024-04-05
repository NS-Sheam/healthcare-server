import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get("/", auth(UserRole.DOCTOR), ScheduleController.getAllSchedules);
router.get("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR), ScheduleController.getByIdFromDB);

router.post("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.insertScheduleIntoDB);
router.delete("/:id", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ScheduleController.deleteFromDB);

export const ScheduleRoutes = router;
