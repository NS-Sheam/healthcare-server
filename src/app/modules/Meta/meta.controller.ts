import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { MetaService } from "./meta.service";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";

const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await MetaService.fetchDashboardMetaData(user as IAuthUser);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Dashboard Meta Data fetched successfully",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
};
