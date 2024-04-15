import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { ReviewService } from "./review.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await ReviewService.insertIntoDB(user as IAuthUser, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const ReviewController = {
  insertIntoDB,
};
