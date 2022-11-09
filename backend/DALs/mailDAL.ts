import { isDailyMissionToSaveWithSub, isWeeklyMissionToSave } from '../utils/missionUtils';
import { GuardingToSave } from './guardingDAL';
import { MissionToSave, DailyMissionToSaveWithSub, WeeklyMissionToSave } from './missionDAL';

export interface Mail {
  subject: string;
  content: string;
  startDate: Date;
  endDate: Date;
  attendees: string[];
  location: string;
  userCredentials: {
    username: string;
    password: string;
  };
}

export interface MailServerResponse {
  responses: [
    {
      id: string;
      body: {
        id: string;
      };
    }
  ];
}

export interface MailInfo {
  index: number;
  eventId: string;
}

export type AssignmentToSave = MissionToSave | GuardingToSave;

export interface MemberAssignment {
  groupMemberId: string;
  assignment: AssignmentToSave;
}

export type MemberDailyMissionWithSub = Omit<MemberAssignment, 'assignment'> & {
  assignment: DailyMissionToSaveWithSub;
};

export type MemberWeeklyMission = Omit<MemberAssignment, 'assignment'> & {
  assignment: WeeklyMissionToSave;
};

export type AssignmentMail = MemberAssignment & {
  mail: Mail;
};

export const isMemberDailyMissionWithSub = (
  object: MemberAssignment
): object is MemberDailyMissionWithSub => isDailyMissionToSaveWithSub(object.assignment);

export const isMemberWeeklyMission = (
  object: MemberAssignment
): object is MemberWeeklyMission => isWeeklyMissionToSave(object.assignment);
