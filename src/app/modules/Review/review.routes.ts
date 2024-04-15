import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.insertIntoDB);

export const ReviewRoutes = router;
