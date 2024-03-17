import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllAdminFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
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
};
