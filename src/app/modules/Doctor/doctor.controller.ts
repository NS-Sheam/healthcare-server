import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DoctorService } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DoctorService.updateDoctor(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

export const DoctorController = {
  updateDoctor,
};
