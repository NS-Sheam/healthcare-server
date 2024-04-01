import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.post("/", fileUploader.upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = specialtiesValidation.createSpecialtyValidationSchema.parse(JSON.parse(req.body.data));
  return SpecialtiesController.insertSpecialtiesIntoDB(req, res, next);
});

export const SpecialtiesRoutes = router;
