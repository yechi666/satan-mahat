import { Activity, ActivityToSave } from '../DALs/missionDAL';

export interface TestGuarding {
  title: string;
  place: string;
  guardings: Activity[];
}

export type GuardingToSave = ActivityToSave & {
  type: 'guarding';
  startDate: Date;
  endDate: Date;
};

export const convertGuardingToSave = (
  description: string,
  startDate: Date,
  endDate: Date,
  eventId: string,
  place: string
): GuardingToSave => ({
  type: 'guarding',
  description,
  startDate,
  endDate,
  eventId,
  place,
});
