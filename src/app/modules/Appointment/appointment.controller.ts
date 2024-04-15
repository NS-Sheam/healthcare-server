import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await AppointmentService.createAppointment(user as IAuthUser, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment booked successfully",
    data: result,
  });
});

const getMyAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;

  const filters = pick(req.query, ["status", "paymentStatus"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AppointmentService.getMyAppointment(user as IAuthUser, filters, options);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment fetched successfully",
    data: result,
  });
});
const changeAppointmentStatus = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await AppointmentService.changeAppointmentStatus();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment status changed successfully",
    data: result,
  });
});
export const AppointmentController = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
};
