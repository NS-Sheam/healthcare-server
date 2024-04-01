import express from "express";
import { DoctorController } from "./doctor.controller";

const router = express.Router();
router.get("/", DoctorController.getAllDoctorFromDB);
router.get("/:id", DoctorController.getByIdFromDB);
router.patch("/:id", DoctorController.updateDoctor);
router.delete("/:id", DoctorController.deleteFromDB);
router.patch("/soft/:id", DoctorController.softDeleteFromDB);

export const DoctorRoutes = router;
