import express from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), PrescriptionController.insertIntoDB);
router.get("/patient-prescription", auth(UserRole.PATIENT), PrescriptionController.patientPrescription);
router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), PrescriptionController.getAllPrescription);
export const PrescriptionRoutes = router;
