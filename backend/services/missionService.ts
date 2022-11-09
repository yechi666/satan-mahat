import { TestGuarding, convertGuardingToSave, GuardingToSave } from '../DALs/guardingDAL';
import { log } from '../logger/logger';
import repository from '../repositories/missionRepository';
import {
  Mission,
  MissionToSend,
  SubMissionToSend,
  AllEventToSave,
  Activity,
  SpecificWeekMission,
  SpecificWeekMissionIntfc,
} from '../DALs/missionDAL';
import { Group } from '../DALs/groupDAL';
import {
  isMemberDailyMissionWithSub,
  isMemberWeeklyMission,
  MemberAssignment,
  MemberDailyMissionWithSub,
  MemberWeeklyMission,
} from '../DALs/mailDAL';
import {
  convertToAssignmentMail,
  sendMails,
  updateMail,
  deleteMail,
  getAssignmentToSave,
  getAssignmentsToSave,
  convertToMail,
} from '../services/mailService';
import { calcDateInWeek, convertDates } from '../utils/utils';
import {
  compareDailyToSaveWithSub,
  compareWeeklyToSave,
  convertMissionToSave,
  fillMissingEventIdInEvent,
  fillMissingEventIdInSub,
  isBasicDailyMissionToSave,
  isGuardingToSave,
  isMissionToSendWithSub,
} from '../utils/missionUtils';

const filterDupMissions = (missions: MemberAssignment[]): MemberAssignment[] => {
  const filled: MemberAssignment[] = [];
  const dailyWithSub: MemberDailyMissionWithSub[] = [];
  const weekly: MemberWeeklyMission[] = [];

  missions.forEach((mission) => {
    if (isBasicDailyMissionToSave(mission.assignment)) {
      filled.push(mission);
    } else if (isMemberDailyMissionWithSub(mission)) {
      dailyWithSub.push(mission);
    } else if (isMemberWeeklyMission(mission)) {
      weekly.push(mission);
    }
  });

  if (dailyWithSub.length > 0) {
    dailyWithSub.forEach((mission) => {
      const inFilled = filled.find(
        compareDailyToSaveWithSub(mission.assignment)
      ) as MemberDailyMissionWithSub;
      if (inFilled) {
        inFilled.assignment.subMissions = inFilled.assignment.subMissions.map(
          fillMissingEventIdInSub(mission.assignment)
        );
      } else {
        filled.push(mission);
      }
    });
  }

  if (weekly.length > 0) {
    weekly.forEach((mission) => {
      const inFilled = filled.find(
        compareWeeklyToSave(mission.assignment)
      ) as MemberWeeklyMission;
      if (inFilled) {
        inFilled.assignment.events = (inFilled.assignment.events as AllEventToSave[]).map(
          fillMissingEventIdInEvent(mission.assignment)
        );
      } else {
        filled.push(mission);
      }
    });
  }

  return filled;
};

const addMailAndDate = (mission: MissionToSend, sub: SubMissionToSend) => (date: Date) => {
  const { startDate, endDate } = convertDates(date, sub.time);

  return convertToAssignmentMail(
    sub.description,
    startDate,
    endDate,
    mission.groupMemberId,
    sub.place,
    convertMissionToSave(mission)
  );
};

const saveAssignment = (assignment: MemberAssignment, groupName: string): Promise<void> =>
  repository.addAssignmentByMemberId(
    groupName,
    assignment.groupMemberId,
    assignment.assignment
  );

const saveAssignments = async (
  assignments: MemberAssignment[],
  groupName: string
): Promise<void> =>
  assignments.forEach((assignment): Promise<void> => saveAssignment(assignment, groupName));

export const sendGuardings = async (
  testGuarding: TestGuarding,
  groupName: string
): Promise<MemberAssignment[]> => {
  log('info', 'tried to send guardings', { testGuarding, groupName });

  const assignmentMails = testGuarding.guardings.map((guarding) => {
    const { startDate, endDate } = convertDates(guarding.date, guarding.time);
    return convertToAssignmentMail(
      testGuarding.title,
      startDate,
      endDate,
      guarding.groupMemberId,
      testGuarding.place,
      convertGuardingToSave(
        testGuarding.title,
        startDate,
        endDate,
        guarding.eventId,
        testGuarding.place
      )
    );
  });
  try {
    const mailsInfo = await sendMails(
      assignmentMails.map((assignmentMail) => assignmentMail.mail)
    );
    const assignmentsToSave = getAssignmentsToSave(assignmentMails, mailsInfo);
    await saveAssignments(assignmentsToSave, groupName);
    return assignmentsToSave;
  } catch (error) {
    log('error', 'failed to save guardings', error);
    throw error;
  }
};

export const updateGuarding = async (guarding: Activity, groupName: string): Promise<void> => {
  log('info', 'tried to update guarding', { guarding, groupName });
  try {
    const {
      assignments: oldGuarding,
      personalNumber: member,
    } = await repository.getMissionByEventId(groupName, guarding.eventId);
    await repository.removeAssignmentByMemberId(groupName, member, oldGuarding);
    const { startDate, endDate } = convertDates(guarding.date, guarding.time);
    await updateMail(oldGuarding.eventId, startDate, endDate);
    return saveAssignment(
      {
        groupMemberId: guarding.groupMemberId,
        assignment: convertGuardingToSave(
          oldGuarding.description,
          startDate,
          endDate,
          guarding.eventId,
          oldGuarding.place
        ),
      },
      groupName
    );
  } catch (error) {
    log('error', 'faild to save guardings', error);
    throw error;
  }
};

export const deleteGuarding = async (guarding: Activity, groupName: string) => {
  log('info', 'tried to delete guarding', { guarding, groupName });

  try {
    const {
      assignments: oldGuarding,
      personalNumber: member,
    } = await repository.getMissionByEventId(groupName, guarding.eventId);

    await deleteMail(guarding.eventId);
    await repository.removeAssignmentByMemberId(groupName, member, oldGuarding);
  } catch (error) {
    log('error', 'faild to save guardings', error);
    throw error;
  }
};

export const deleteMultipleGuardings = async (guardings: Activity[], groupName: string) => {
  log('info', 'tried to delete guardings', { guardings, groupName });

  try {
    guardings.forEach((guarding) => deleteGuarding(guarding, groupName));
  } catch (error) {
    log('error', 'failed to delete guardings', error);
    throw error;
  }
};

const isForToday = (date: Date) => (sub: SubMissionToSend) =>
  sub.days === undefined || sub.days?.includes(new Date(date).getDay() + 1);

export const sendMissions = async (
  missions: MissionToSend[],
  groupName: string
): Promise<void> => {
  console.log(`checking flat map: ${[].flatMap(() => 1)}`);
  log('info', 'tried to send missions', { missions, groupName });
  try {
    const assignmentMails = missions.flatMap((mission) => {
      if (isMissionToSendWithSub(mission)) {
        if (mission.type === 'daily') {
          mission.subMissions = mission.subMissions.filter(isForToday(mission.date));

          return mission.subMissions.map((subMission) =>
            addMailAndDate(mission, subMission)(mission.date)
          );
        } else if (mission.type === 'weekly') {
          return mission.subMissions.flatMap((sub) => {
            const weekDates = sub.days?.map((day) => calcDateInWeek(mission.date, day));

            return weekDates.map(addMailAndDate(mission, sub));
          });
        }
      } else if (mission.type === 'weekly') {
        const weekDates = mission.days?.map((day) => calcDateInWeek(mission.date, day));

        return weekDates.map(addMailAndDate(mission, mission));
      } else if (mission.type === 'daily') {
        return addMailAndDate(mission, mission)(mission.date);
      }
    });

    await sendMails(assignmentMails.map((assignmentMail) => assignmentMail.mail));
    saveAssignments(filterDupMissions(assignmentMails), groupName);
  } catch (error) {
    console.error(`error - faild to send or save missions\n${error.message}`);
    // log('error', 'faild to send or save missions', error.message);
    throw error;
  }
};

export const getMissionsByMemberName = (
  groupName: string,
  memberName: string
): Promise<Group[]> => {
  log('info', 'requested all missions of member by name', { groupName, memberName });

  return repository.getMissionsByMemberName(groupName, memberName);
};

export const getGroupMissions = (groupName: string): Promise<Group[]> => {
  log('info', 'requested all missions of group by name', { groupName });

  return repository.getGroupMissions(groupName);
};

export const getMissionsByMemberPerNum = (
  groupName: string,
  memberPersonalNumber: string
): Promise<Group[]> => {
  log('info', 'requested all missions of member by personalNumber', {
    groupName,
    memberPersonalNumber,
  });

  return repository.getMissionsByMemberPerNum(groupName, memberPersonalNumber);
};

export const getMissionsByMemberNameAndType = (
  groupName: string,
  memberName: string,
  type: string
): Promise<Group> => {
  log('info', 'requested all missions of specific type and member by name', {
    groupName,
    memberName,
    type,
  });

  return repository.getMissionsByMemberNameAndType(groupName, memberName, type);
};

export const getMissionsByMemberPerNumAndType = (
  groupName: string,
  memberPersonalNumber: string,
  type: string
): Promise<Group> => {
  log('info', 'req uested all missions of specific type and member by personalNumber', {
    groupName,
    memberPersonalNumber,
    type,
  });

  return repository.getMissionsByMemberPerNumAndType(groupName, memberPersonalNumber, type);
};

export const getGuardingsByGroupAndTest = (
  groupName: string,
  test: string
): Promise<GuardingToSave[]> => {
  log('info', 'requested all guardings by group and test', {
    groupName,
    test,
  });
  return repository.getGuardingsByGroupAndTest(groupName, test);
};

export const getGroupMissionsByType = (groupName: string, type: string): Promise<Group> => {
  log('info', 'requested all missions of specific type in group', { groupName, type });

  return repository.getGroupMissionsByType(groupName, type);
};

export const addMissionsByMemberName = (
  groupName: string,
  memberName: string,
  mission: Mission
): Promise<Group> => {
  log('info', 'tried to add mission to member of group', { groupName, memberName, mission });

  return repository.addMissionsByMemberName(groupName, memberName, mission);
};

export const getAssignmentCountByMember = (
  groupName: string,
  assignmentDescription: string
): Promise<Number[]> => {
  log('info', 'tried to get all the assignment count of all members in group', {
    groupName,
    assignmentDescription,
  });

  return repository.getAssignmentCountByMember(groupName, assignmentDescription);
};

export const getGuardingTimeByMembers = (groupName: string): Promise<Number[]> => {
  log('info', 'tried to get all the groups members guarding time', { groupName });

  return repository.getGuardingTimeByMembers(groupName);
};

export const getOldMissions = async (
  groupName: string,
  firstDay: Date
): Promise<SpecificWeekMissionIntfc[]> => {
  log('info', `tried to get all missions for ${firstDay}`, { groupName });

  const sunday = new Date(firstDay);
  sunday.setHours(0, 0, 0, 0);
  const saturday = calcDateInWeek(firstDay, 7);

  return await repository.getOldMissionsByWeek(
    groupName,
    sunday,
    saturday
  );;
};

export default {
  sendGuardings,
  updateGuarding,
  deleteMultipleGuardings,
  sendMissions,
  getMissionsByMemberName,
  getGroupMissions,
  getMissionsByMemberPerNum,
  getMissionsByMemberNameAndType,
  getMissionsByMemberPerNumAndType,
  getGroupMissionsByType,
  addMissionsByMemberName,
  getAssignmentCountByMember,
  getGuardingTimeByMembers,
  getGuardingsByGroupAndTest,
  deleteGuarding,
  getOldMissions,
};
