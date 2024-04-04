import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", fileUploader.upload.single("file"), (req: Request, res: Response, next: NextFunction) => {
  req.body = specialtiesValidation.createSpecialtyValidationSchema.parse(JSON.parse(req.body.data));
  return SpecialtiesController.insertSpecialtiesIntoDB(req, res, next);
});

router.get("/:id", SpecialtiesController.getSpecialtyById);
router.get("/", SpecialtiesController.getAllSpecialties);
router.delete("/:id", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialtiesController.deleteSpecialty);

export const SpecialtiesRoutes = router;
