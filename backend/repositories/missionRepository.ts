import { AssignmentToSave } from '../DALs/mailDAL';
import GroupSchema, { Group } from '../DALs/groupDAL';
import { Mission, SpecificWeekMissionIntfc } from '../DALs/missionDAL';
import { GuardingToSave } from '../DALs/guardingDAL';

export const getMissionsByMemberName = (
  groupName: string,
  memberName: string
): Promise<Group[]> =>
  GroupSchema.find({ name: groupName }, { members: { $elemMatch: { name: memberName } } })
    .select('-_id members.assignments')
    .exec();

export const getGroupMissions = (groupName: string): Promise<Group[]> =>
  GroupSchema.find({ name: groupName }).select('-_id members.assignments').exec();

export const getMissionsByMemberPerNum = (
  groupName: string,
  memberPersonalNumber: string
): Promise<Group[]> =>
  GroupSchema.find(
    {
      name: groupName,
    },
    { members: { $elemMatch: { personalNumber: memberPersonalNumber } } }
  )
    .select('-_id members.assignments')
    .exec();

export const getMissionByEventId = async (
  groupName: string,
  eventId: string
): Promise<{ assignments: GuardingToSave; personalNumber: string }> => {
  try {
    return (
      await GroupSchema.aggregate([
        { $match: { name: groupName } },
        { $unwind: '$members' },
        {
          $project: {
            'members.assignments': {
              $filter: {
                input: '$members.assignments',
                as: 'ms',
                cond: {
                  $eq: ['$$ms.eventId', eventId],
                },
              },
            },
            'members.personalNumber': 1,

            _id: 0,
          },
        },
        { $unwind: { path: '$members.assignments', preserveNullAndEmptyArrays: false } },
      ]).exec()
    )[0].members;
  } catch {
    throw new Error('המשימה אינה קיימת');
  }
};

export const getMissionsByMemberNameAndType = (
  groupName: string,
  memberName: string,
  type: string
): Promise<Group> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    { $match: { 'members.name': memberName } },
    {
      $project: {
        'members.assignments': {
          $filter: {
            input: '$members.assignments',
            as: 'ms',
            cond: { $eq: ['$$ms.type', type] },
          },
        },
      },
    },
  ]).exec();

export const getMissionsByMemberPerNumAndType = (
  groupName: string,
  memberPersonalNumber: string,
  type: string
): Promise<Group> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    { $match: { 'members.personalNumber': memberPersonalNumber } },
    {
      $project: {
        'members.assignments': {
          $filter: {
            input: '$members.assignments',
            as: 'ms',
            cond: { $eq: ['$$ms.type', type] },
          },
        },
      },
    },
  ]).exec();

export const getGroupMissionsByType = (groupName: string, type: string): Promise<Group> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    {
      $project: {
        'members.assignments': {
          $filter: {
            input: '$members.assignments',
            as: 'ms',
            cond: { $eq: ['$$ms.type', type] },
          },
        },
        'members.name': 1,
        'members.personalNumber': 1,
      },
    },

    { $match: { 'members.assignments': { $ne: [] } } },
  ]).exec();

export const getGroupMissionsByTypeAndDescription = (
  groupName: string,
  type: string
): Promise<Group> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    {
      $project: {
        'members.assignments': {
          $filter: {
            input: '$members.assignments',
            as: 'ms',
            cond: { $eq: ['$$ms.type', type] },
          },
        },
        'members.name': 1,
        'members.personalNumber': 1,
      },
    },

    { $match: { 'members.assignments': { $ne: [] } } },
  ]).exec();

export const getGuardingsByGroupAndTest = async (
  groupName: string,
  test: string
): Promise<GuardingToSave[]> =>
  (
    await GroupSchema.aggregate([
      { $match: { name: groupName } },
      { $unwind: '$members' },
      {
        $addFields: {
          'members.assignments.member': '$members.personalNumber',
        },
      },
      {
        $project: {
          assignments: {
            $filter: {
              input: '$members.assignments',
              as: 'ms',
              cond: {
                $and: [
                  { $eq: ['$$ms.type', 'guarding'] },
                  { $eq: ['$$ms.description', test] },
                ],
              },
            },
          },
        },
      },
      { $unwind: '$assignments' },
      {
        $group: {
          _id: null,
          guardings: { $addToSet: '$assignments' },
        },
      },
    ]).exec()
  )[0].guardings;

export const addMissionsByMemberName = (
  groupName: string,
  memberName: string,
  mission: Mission
): Promise<Group> =>
  GroupSchema.updateOne(
    { name: groupName, members: { $elemMatch: { name: memberName } } },
    { $push: { 'members.$.assignments': mission } }
  );

export const addAssignmentByMemberId = async (
  groupName: string,
  groupMemberId: string,
  assignment: AssignmentToSave
): Promise<void> =>
  await GroupSchema.updateOne(
    {
      name: groupName,
      members: { $elemMatch: { personalNumber: groupMemberId } },
    },
    { $push: { 'members.$.assignments': assignment } }
  );

export const removeAssignmentByMemberId = (
  groupName: string,
  groupMemberId: string,
  assignment: AssignmentToSave
): Promise<Group> =>
  GroupSchema.updateOne(
    {
      name: groupName,
      members: { $elemMatch: { personalNumber: groupMemberId } },
    },
    { $pull: { 'members.$.assignments': assignment } }
  );

const getGuardingTimeByMembers = (groupName: string): Promise<Number[]> => {
  return GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    {
      $project: {
        name: '$members.name',
        guardMissions: {
          $filter: {
            input: '$members.assignments',
            as: 'mission',
            cond: { $eq: ['$$mission.type', 'guarding'] },
          },
        },
      },
    },
    { $unwind: { path: '$guardMissions', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: 1,
        endDate: { $toDate: '$guardMissions.endDate' },
        startDate: { $toDate: '$guardMissions.startDate' },
      },
    },
    {
      $project: {
        name: 1,
        totalHours: { $divide: [{ $subtract: ['$endDate', '$startDate'] }, 3600000] },
      },
    },
    {
      $group: {
        _id: '$name',
        totalHours: {
          $sum: '$totalHours',
        },
      },
    },
  ]).exec();
};

const getAssignmentCountByMember = (
  groupName: string,
  assignmentDescription: string
): Promise<Number[]> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    {
      $project: {
        name: '$members.name',
        countMissions: {
          $size: {
            $filter: {
              input: '$members.assignments',
              as: 'mission',
              cond: { $eq: ['$$mission.description', assignmentDescription] },
            },
          },
        },
      },
    },
  ]).exec();

const getOldMissionsByWeek = async (
  groupName: string,
  sunday: Date,
  saturday: Date
): Promise<SpecificWeekMissionIntfc[]> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    {
      $project: {
        _id: 0,
        missions: {
          $filter: {
            input: '$members.assignments',
            as: 'mission',
            cond: {
              $and: [
                { $ne: ['$$mission.type', 'guarding'] },
                { $gte: ['$$mission.date', sunday] },
                { $lte: ['$$mission.date', saturday] },
              ],
            },
          },
        },
        'members.name': 1,
      },
    },
    {
      $project: {
        'members.name': 1,
        descAndDate: {
          $zip: {
            inputs: ['$missions.date', '$missions.description'],
          },
        },
      },
    },
    { $unwind: '$descAndDate' },
    {
      $project: {
        name: '$members.name',
        date: { $arrayElemAt: ['$descAndDate', 0] },
        description: { $arrayElemAt: ['$descAndDate', 1] },
      },
    },
  ]).exec();

export default {
  getMissionsByMemberName,
  getGroupMissions,
  getMissionsByMemberPerNum,
  getMissionsByMemberNameAndType,
  getMissionsByMemberPerNumAndType,
  getGroupMissionsByType,
  addMissionsByMemberName,
  addAssignmentByMemberId,
  getAssignmentCountByMember,
  getGuardingTimeByMembers,
  getGuardingsByGroupAndTest,
  getMissionByEventId,
  removeAssignmentByMemberId,
  getOldMissionsByWeek,
};
