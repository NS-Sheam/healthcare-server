import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const result = await PaymentService.initPayment(appointmentId);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});
const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.query);
  sendResponse(res, {
    status: 200,
    success: true,
    message: "Payment validated successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
};