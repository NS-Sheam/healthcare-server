import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorScheduleService.insertIntoDB(req.user, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
};