import express from "express";
import { PatientController } from "./patient.controller";

const router = express.Router();
router.get("/", PatientController.getAllPatientFromDB);
router.get("/:id", PatientController.getByIdFromDB);
router.patch("/:id", PatientController.updatePatient);
router.delete("/:id", PatientController.deleteFromDB);
router.patch("/soft/:id", PatientController.softDeleteFromDB);

export const patientRoutes = router;
