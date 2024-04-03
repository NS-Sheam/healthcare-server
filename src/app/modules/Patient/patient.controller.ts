import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PatientService } from "./patient.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { patientFilterableFields } from "./patient.const";

const getAllPatientFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PatientService.getAllPatientFromDB(filters, options);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Patient fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Patient fetched successfully",
    data: result,
  });
});

const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.updatePatient(id, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Patient updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deleteFromDB(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Patient deleted successfully",
    data: result,
  });
});

const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDeleteFromDB(id);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Patient soft deleted successfully",
    data: result,
  });
});

export const PatientController = {
  getAllPatientFromDB,
  getByIdFromDB,
  updatePatient,
  deleteFromDB,
  softDeleteFromDB,
};
