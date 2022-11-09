export type MissionTypes = 'weekly' | 'daily';

interface BasicMission {
  type: MissionTypes;
  description: string;
  isMultipleMembers?: boolean;
  place?: string;
  startTime: string;
  endTime: string;
  days?: number[];
}

type SubMission = Omit<BasicMission, 'type'>;

type MissionWithSub = Pick<BasicMission, 'description' | 'days' | 'type'> & {
  subMissions: SubMission[];
};

export type Mission =
  | BasicMission
  | (MissionWithSub & Pick<BasicMission, 'isMultipleMembers'>);

interface TimeToSend {
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

type BasicMissionToSend = Pick<BasicMission, 'description' | 'place' | 'days' | 'type'> &
  Activity;

type SubMissionToSend = Pick<BasicMissionToSend, 'description' | 'place' | 'time' | 'days'>;

type MissionToSendWithSub = Pick<
  BasicMissionToSend,
  'description' | 'date' | 'groupMemberId' | 'days' | 'type'
> & {
  subMissions: SubMissionToSend[];
};

export type MissionToSend = BasicMissionToSend | MissionToSendWithSub;

const isMissionWithSub = (object: Mission): object is MissionWithSub =>
  'subMissions' in object;

const convertSubMissionToSend = (subMisisons: SubMission[]): SubMissionToSend[] =>
  subMisisons.map((subMission) => ({
    description: subMission.description,
    place: subMission.place,
    time: {
      startHour: parseInt(subMission.startTime.split(':')[0]),
      startMinute: parseInt(subMission.startTime.split(':')[1]),
      endHour: parseInt(subMission.endTime.split(':')[0]),
      endMinute: parseInt(subMission.endTime.split(':')[1]),
    },
    days: subMission.days,
  }));

const convertDailyMissionToSendWithSub = (
  mission: MissionWithSub,
  date: Date,
  groupMemberId: string
): MissionToSend => ({
  description: mission.description,
  date,
  subMissions: convertSubMissionToSend(mission.subMissions),
  groupMemberId,
  days: mission.days,
  type: mission.type,
});

const convertWeeklyMissionToSendWithSub = (
  mission: MissionWithSub,
  date: Date,
  groupMemberId: string
): MissionToSend => ({
  description: mission.description,
  date,
  subMissions: convertSubMissionToSend(mission.subMissions),
  groupMemberId,
  type: mission.type,
});

const convertBasicMissionToSend = (
  mission: BasicMission,
  date: Date,
  groupMemberId: string
): MissionToSend => ({
  description: mission.description,
  date,
  place: mission.place,
  time: {
    startHour: parseInt(mission.startTime.split(':')[0]),
    startMinute: parseInt(mission.startTime.split(':')[1]),
    endHour: parseInt(mission.endTime.split(':')[0]),
    endMinute: parseInt(mission.endTime.split(':')[1]),
  },
  groupMemberId,
  days: mission.days,
  type: mission.type,
});

export const missionConvertToSend = (
  mission: Mission,
  date: Date,
  groupMemberId: string
): MissionToSend =>
  isMissionWithSub(mission)
    ? mission.type === 'daily'
      ? convertDailyMissionToSendWithSub(mission, date, groupMemberId)
      : convertWeeklyMissionToSendWithSub(mission, date, groupMemberId)
    : convertBasicMissionToSend(mission, date, groupMemberId);

export const isMissionAlreadyExist = (
  firstMission: MissionToSend,
  secondMission: MissionToSend
): boolean =>
  firstMission.date.getTime() === secondMission.date.getTime() &&
  firstMission.description === secondMission.description;

export const isMemberAlreadyExistsInMission = (
  firstMission: MissionToSend,
  secondMission: MissionToSend
): boolean =>
  firstMission.date.getTime() === secondMission.date.getTime() &&
  firstMission.description === secondMission.description &&
  firstMission.groupMemberId === secondMission.groupMemberId;

export interface SpecificWeekMissionIntfc {
  name: string;
  date: Date;
  description: string;
}

export type SpecificWeekMission = SpecificWeekMissionIntfc;
