import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.initPayment();
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
};
