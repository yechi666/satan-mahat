import GroupSchema, { Group } from '../DALs/groupDAL';
import { Mission } from '../DALs/missionDAL';

export const getGroupMissionStructure = (groupName: string): Promise<Group[]> =>
  GroupSchema.find({ name: groupName }).select('-_id missionsStructure').exec();

export const getGroupMissionStructureByType = (
  groupName: string,
  type: string
): Promise<Group[]> =>
  GroupSchema.aggregate([
    { $match: { name: groupName } },
    {
      $project: {
        missionsStructure: {
          $filter: {
            input: '$missionsStructure',
            as: 'ms',
            cond: { $eq: ['$$ms.type', type] },
          },
        },
      },
    },
  ]).exec();

export const addMissionStructureToGroup = (
  groupName: string,
  missionStructure: Mission
): Promise<Group> =>
  GroupSchema.updateOne(
    { name: groupName },
    { $push: { missionsStructure: missionStructure } }
  );

export default {
  getGroupMissionStructure,
  getGroupMissionStructureByType,
  addMissionStructureToGroup,
};
