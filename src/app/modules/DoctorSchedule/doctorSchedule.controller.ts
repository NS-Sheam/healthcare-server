import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./doctorSchedule.const";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const result = await DoctorScheduleService.insertIntoDB(req.user, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
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
    status: httpStatus.OK,
    success: true,
    message: "Doctor Schedules fetched successfully",
    data: result,
  });
});
const deleteFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;

  const { id } = req.params;
  const result = await DoctorScheduleService.deleteFromDB(user as IAuthUser, id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor Schedule deleted successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorScheduleService.getAllFromDB(filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const DoctorScheduleController = {
  insertIntoDB,
  getMySchedules,
  deleteFromDB,
  getAllFromDB,
};
