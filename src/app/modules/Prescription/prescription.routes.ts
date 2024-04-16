import express from "express";
import { PrescriptionController } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { PrescriptionValidation } from "./prescription.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(PrescriptionValidation.create),
  PrescriptionController.insertIntoDB
);
router.get("/patient-prescription", auth(UserRole.PATIENT), PrescriptionController.patientPrescription);
router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), PrescriptionController.getAllFromDB);
export const PrescriptionRoutes = router;
