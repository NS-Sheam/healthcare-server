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

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesService.getAllSpecialties();
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Specialties fetched successfully",
    data: result,
  });
});

const getSpecialtyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialtiesService.getSpecialtyById(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Specialty fetched successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  insertSpecialtiesIntoDB,
  getAllSpecialties,
  getSpecialtyById,
};
