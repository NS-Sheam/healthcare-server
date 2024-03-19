import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.const";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    status: number;
    success: boolean;
    message: string;
    meta?: {
      total: number;
      page: number;
      limit: number;
    };
    data?: T | null | undefined;
  }
) => {
  res.status(jsonData.status).json({
    success: jsonData.success,
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
  });
};

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AdminService.getAllAdminFromDB(filters, options);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Admin fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.getByIdFromDB(id);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Admin fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};
const updateIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.updateIntoDB(id, req.body);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};
const deleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};
const softDeleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.softDeleteFromDB(id);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "Admin soft deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};

export const AdminController = {
  getAllAdminFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
