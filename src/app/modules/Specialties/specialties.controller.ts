import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const insertSpecialtiesIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.insertSpecialtiesIntoDB(req);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Specialties inserted successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  insertSpecialtiesIntoDB,
};
