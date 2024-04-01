import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.const";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getAllUserFromDB(filters, options);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User profile status changed successfully",
    data: result,
  });
});
const getMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await userService.getMyProfile(user as IAuthUser);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const user = req.user;
  const result = await userService.updateMyProfile(user as IAuthUser, req);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUserFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
