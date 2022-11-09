import { GuardingToSave } from '../DALs/guardingDAL';
import {
  AssignmentToSave,
  MemberAssignment,
  MemberDailyMissionWithSub,
  MemberWeeklyMission,
} from '../DALs/mailDAL';
import {
  ActivityToSave,
  AllEventToSave,
  BasicDailyMissionToSave,
  DailyMissionToSaveWithSub,
  EventToSave,
  EventToSaveWithDesc,
  MissionToSave,
  MissionToSend,
  MissionToSendWithSub,
  WeeklyMissionToSave,
  WeeklyMissionToSaveWithSub,
} from '../DALs/missionDAL';
import { calcDateInWeek } from './utils';

export const isMissionToSendWithSub = (
  object: MissionToSend
): object is MissionToSendWithSub => 'subMissions' in object;

export const convertMissionToSave = (mission: MissionToSend): MissionToSave => {
  return isMissionToSendWithSub(mission)
    ? mission.type === 'daily'
      ? {
          type: 'daily',
          description: mission.description,
          date: mission.date,
          subMissions: mission.subMissions.map(
            (sub): ActivityToSave => ({
              description: sub.description,
              eventId: '',
              place: '',
            })
          ),
        }
      : {
          type: 'weekly',
          description: mission.description,
          events: mission.subMissions.flatMap((sub): EventToSaveWithDesc[] =>
            sub?.days.map(
              (day): EventToSaveWithDesc => ({
                description: sub.description,
                date: calcDateInWeek(mission.date, day),
                eventId: '',
              })
            )
          ),
        }
    : mission.type === 'daily'
    ? {
        type: 'daily',
        description: mission.description,
        date: mission.date,
        eventId: '',
        place: '',
      }
    : {
        type: 'weekly',
        description: mission.description,
        events: mission?.days.map(
          (day): EventToSave => ({
            date: calcDateInWeek(mission.date, day),
            eventId: '',
          })
        ),
      };
};

export const isDailyMissionToSaveWithSub = (
  object: AssignmentToSave
): object is DailyMissionToSaveWithSub => 'subMissions' in object;

export const isBasicDailyMissionToSave = (
  object: AssignmentToSave
): object is BasicDailyMissionToSave => !('subMissions' in object) && object.type === 'daily';

export const isGuardingToSave = (object: AssignmentToSave): object is GuardingToSave =>
  object.type === 'guarding';

export const isWeeklyMissionToSave = (
  object: AssignmentToSave
): object is WeeklyMissionToSave => object.type === 'weekly';

export const isWeeklyMissionToSaveWithSub = (
  object: WeeklyMissionToSave
): object is WeeklyMissionToSaveWithSub => 'description' in object.events;

export const isMissionWithSub = (
  object: AssignmentToSave
): object is DailyMissionToSaveWithSub | WeeklyMissionToSave => {
  return isWeeklyMissionToSave(object)
    ? isWeeklyMissionToSaveWithSub(object)
    : isDailyMissionToSaveWithSub(object);
};

export const compareDailyToSaveWithSub = (assignment: DailyMissionToSaveWithSub) => (
  curr: MemberDailyMissionWithSub
): boolean =>
  curr.assignment.description === assignment.description &&
  curr.assignment.date === assignment.date;

export const compareWeeklyToSave = (assignment: WeeklyMissionToSave) => (
  curr: MemberAssignment
): boolean => curr.assignment.description === assignment.description;

type EventToSaveFunc = (event: EventToSave, index: number) => EventToSave;
type EventToSaveWithDescFunc = (
  event: EventToSaveWithDesc,
  index: number
) => EventToSaveWithDesc;
type AllEventToSaveFunc = EventToSaveFunc | EventToSaveWithDescFunc;

export const fillMissingEventIdInSub = (assignment: DailyMissionToSaveWithSub) => (
  sub: ActivityToSave,
  index: number
): ActivityToSave => (sub.eventId !== '' ? sub : assignment.subMissions[index]);

export function fillMissingEventIdInEvent(assignment: WeeklyMissionToSave): EventToSaveFunc;
export function fillMissingEventIdInEvent(
  assignment: WeeklyMissionToSave
): EventToSaveWithDescFunc;
export function fillMissingEventIdInEvent(
  assignment: WeeklyMissionToSave
): AllEventToSaveFunc {
  return (event: AllEventToSave, index: number) =>
    event.eventId !== '' ? event : assignment.events[index];
}
