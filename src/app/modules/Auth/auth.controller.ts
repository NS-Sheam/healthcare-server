import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Login successfully",
    data: {
      accessToken: result.accessToken,
      needpasswordChange: result.needPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Refresh token generated successfully",
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await AuthServices.changePassword(req.user, req.body);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
