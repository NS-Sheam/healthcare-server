import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.insertIntoDB);
router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), ReviewController.getAllReviews);
export const ReviewRoutes = router;
