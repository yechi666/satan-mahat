import mongoose from 'mongoose';
import { SubMission, SubMissionSchema } from './subMissionDAL';

type MissionTypes = 'weekly' | 'daily';

export interface Mission extends mongoose.Document {
  type: string;
  description: string;
  subMissions: SubMission[];
  place: string;
  date: Date;
  startTime: string;
  endTime: string;
  days: number[];
  startDate: Date;
  endDate: Date;
  eventId: string;
}

export const MissionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  isMultipleMembers: { type: Boolean },
  subMissions: { type: [SubMissionSchema], default: undefined },
  place: { type: String },
  date: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  days: { type: [{ type: Number }], default: undefined },
  startDate: { type: Date },
  endDate: { type: Date },
  eventId: { type: String },
});

export default mongoose.model<Mission>('Mission', MissionSchema);

interface BasicMission {
  type: MissionTypes;
  description: string;
  place?: string;
  startTime: string;
  endTime: string;
  days?: number[];
}

export interface TimeToSend {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface Activity {
  date: Date;
  time: TimeToSend;
  groupMemberId: string;
  eventId?: string;
}

type BasicMissionToSend = Pick<BasicMission, 'description' | 'place' | 'type' | 'days'> &
  Activity;

export type SubMissionToSend = Pick<
  BasicMissionToSend,
  'description' | 'place' | 'time' | 'days'
>;

export type MissionToSendWithSub = Pick<
  BasicMissionToSend,
  'description' | 'date' | 'groupMemberId' | 'type' | 'days'
> & {
  subMissions: SubMissionToSend[];
};

export type MissionToSend = BasicMissionToSend | MissionToSendWithSub;

export interface ActivityToSave {
  description: string;
  place: string;
  eventId: string;
}

export type EventToSave = Pick<ActivityToSave, 'eventId'> & {
  date: Date;
};

export type BasicDailyMissionToSave = ActivityToSave & {
  type: 'daily';
  date: Date;
};

export type DailyMissionToSaveWithSub = Pick<
  BasicDailyMissionToSave,
  'type' | 'description' | 'date'
> & {
  subMissions: ActivityToSave[];
};

type DailyMissionToSave = BasicDailyMissionToSave | DailyMissionToSaveWithSub;

type BasicWeeklyMissionToSave = {
  type: 'weekly';
  description: string;
  events: EventToSave[];
};

export type EventToSaveWithDesc = EventToSave & {
  description: string;
};

export type AllEventToSave = EventToSaveWithDesc | EventToSave;

export type WeeklyMissionToSaveWithSub = Omit<BasicWeeklyMissionToSave, 'events'> & {
  events: EventToSaveWithDesc[];
};

export type WeeklyMissionToSave = BasicWeeklyMissionToSave | WeeklyMissionToSaveWithSub;

export type MissionToSave = DailyMissionToSave | WeeklyMissionToSave;

export interface SpecificWeekMissionIntfc {
  name: string;
  date: Date;
  description: string;
}

export type SpecificWeekMission = SpecificWeekMissionIntfc;
