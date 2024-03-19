import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.const";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdminFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AdminService.getAllAdminFromDB(filters, options);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateIntoDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const deleteFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const softDeleteFromDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllAdminFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
