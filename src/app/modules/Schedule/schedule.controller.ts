import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";

const insertScheduleIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.insertScheduleIntoDB(req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});
const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["startDate", "endDate"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await ScheduleService.getAllSchedules(filter, options);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Schedules fetched successfully",
    data: result,
  });
});

export const ScheduleController = {
  insertScheduleIntoDB,
  getAllSchedules,
};
