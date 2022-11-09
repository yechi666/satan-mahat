import { Activity } from '../Data/Missions';

const checkIfTimeValid = function checkIfTimeValid(guarding: Activity) {
  const totalEndMinutes = guarding.time.endHour * 60 + guarding.time.endMinute;
  const totalStartMinutes = guarding.time.startHour * 60 + guarding.time.startMinute;

  return totalEndMinutes > totalStartMinutes;
};

export { checkIfTimeValid };
