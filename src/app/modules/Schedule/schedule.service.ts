import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
const insertScheduleIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervelTime = 30;
  const schedules = [];

  const currentDate = new Date(startDate); // Start Date
  const lastDate = new Date(endDate); // End Date
  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(`${format(currentDate, "yyyy-MM-dd")}`, Number(startTime.split(":")[0])),
        Number(startTime.split(":")[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        addHours(`${format(currentDate, "yyyy-MM-dd")}`, Number(endTime.split(":")[0])),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervelTime),
      };
      const result = await prisma.schedule.create({
        data: scheduleData,
      });
      schedules.push(result);
      startDateTime.setMinutes(startDateTime.getMinutes() + intervelTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

export const ScheduleService = {
  insertScheduleIntoDB,
};
