import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../shared/pick";

const getAllAdminFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "name", "email", "contactNumber"]);

  try {
    const result = await AdminService.getAllAdminFromDB(filters);
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
