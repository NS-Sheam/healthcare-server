import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await DoctorScheduleService.insertIntoDB(req.user, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});
const getMySchedules = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const filter = pick(req.query, ["startDate", "endDate", "isBooked"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await DoctorScheduleService.getMySchedules(filter, options, user as IAuthUser);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor Schedules fetched successfully",
    data: result,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedules,
};
