import { TimeToSend } from '../DALs/missionDAL';

export const calcDateInWeek = (sunday: Date, weekDay: number): Date => {
  const date = new Date(sunday);
  date.setDate(date.getDate() + weekDay - 1);

  return date;
};

export const convertDates = (
  date: Date,
  time: TimeToSend
): Record<string, Date> => {
  const startDate = new Date(date);
  startDate.setHours(time.startHour);
  startDate.setMinutes(time.startMinute);
  const endDate = new Date(date);
  endDate.setHours(time.endHour);
  endDate.setMinutes(time.endMinute);

  return { startDate, endDate };
};
