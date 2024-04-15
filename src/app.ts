import express, { Application, NextFunction, Request, Response } from "express";

import cors from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";
const app: Application = express();
app.use(cors());
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
    console.log("running a task every minute");
  } catch (error) {
    console.error(error);
  }
});
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Health care server...",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
