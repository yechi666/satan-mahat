import GroupSchema from '../DALs/groupDAL';
import { Group } from '../DALs/groupDAL';

export const getAll = (): Promise<Group[]> => GroupSchema.find().exec();

export const getAllGroupNames = (): Promise<Group[]> =>
  GroupSchema.find().select('-_id name').exec();

export const getGroupByName = (name: string): Promise<Group> =>
  GroupSchema.findOne({ name: name }).exec();

export const addNewGroup = (name: string): Promise<Group> => {
  const newGroup = new GroupSchema({
    _id: null,
    name: name,
    missionsStructure: [],
    members: [],
    oceanGroupId: ' ',
  });
  return newGroup.save();
};

export const addWholeGroup = (group: Group): Promise<Group> => {
  group._id = null;
  const newGroup = new GroupSchema(group);
  return newGroup.save();
};

export const deleteGroup = (groupId: string): Promise<string> => {
  return GroupSchema.deleteOne({ _id: groupId });
};
export const getAllGroupNamesByAdmin = (personalNumber: string): Promise<Group[]> =>
  GroupSchema.find({ manager: personalNumber }).select('-_id name').exec();

export const getAllGroupByAdmin = (personalNumber: string): Promise<Group[]> =>
  GroupSchema.find({ manager: personalNumber }).exec();

export default {
  getAll,
  getAllGroupNames,
  getGroupByName,
  addNewGroup,
  addWholeGroup,
  deleteGroup,
  getAllGroupNamesByAdmin,
  getAllGroupByAdmin,
};
