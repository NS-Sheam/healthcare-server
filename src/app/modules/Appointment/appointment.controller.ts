import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const result = await AppointmentService.createAppointment();
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Appointment created successfully",
    data: result,
  });
});

export const AppointmentController = {
  createAppointment,
};
