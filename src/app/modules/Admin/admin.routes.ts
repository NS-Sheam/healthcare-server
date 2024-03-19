import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();
router.get("/", AdminController.getAllAdminFromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFromDB);
router.patch("/soft/:id", AdminController.softDeleteFromDB);

export const AdminRoutes = router;
