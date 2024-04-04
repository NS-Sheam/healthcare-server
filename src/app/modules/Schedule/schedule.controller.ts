import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";

const insertScheduleIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertScheduleIntoDB(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertScheduleIntoDB,
};
