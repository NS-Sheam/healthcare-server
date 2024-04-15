import httpStatus from "http-status";
import { PrescriptionService } from "./prescription.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await PrescriptionService.insertIntoDB(user as IAuthUser, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Prescription created successfully",
    data: result,
  });
});

export const PrescriptionController = {
  insertIntoDB,
};
