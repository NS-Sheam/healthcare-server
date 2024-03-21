import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { AnyZodObject, z } from "zod";

const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string().optiona(),
    contactNumber: z.string().optional(),
  }),
});

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
    });
    return next();
  } catch (error) {
    next(error);
  }
};

router.get("/", AdminController.getAllAdminFromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", validateRequest(update), AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFromDB);
router.patch("/soft/:id", AdminController.softDeleteFromDB);

export const AdminRoutes = router;
