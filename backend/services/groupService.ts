import { Group } from '../DALs/groupDAL';
import { log } from '../logger/logger';
import repository from '../repositories/groupRepository';

export const getAll = (): Promise<Group[]> => {
  log('info', 'requested all groups', {});

  return repository.getAll();
};

export const getAllGroupNames = (): Promise<Group[]> => {
  log('info', 'requested all groups names', {});

  return repository.getAllGroupNames();
};

export const getGroupByName = (name: string): Promise<Group> => {
  log('info', 'requested specific group', { name });

  return repository.getGroupByName(name);
};

export const addNewGroup = (name: string): Promise<Group> => {
  log('info', 'tried to add new group', { name });

  return repository.addNewGroup(name);
};

export const addWholeGroup = (group: Group): Promise<Group> => {
  log('info', 'tried to add whole group', { group });

  return repository.addWholeGroup(group);
};

export const deleteGroup = (groupId: string): Promise<string> => {
  log('info', 'tried delete group with id: ', { groupId });

  return repository.deleteGroup(groupId);
};
export const getAllGroupByAdmin = (personalNumber: string): Promise<Group[]> => {
  log('info', `requested all groups for admin ${personalNumber}`);

  return repository.getAllGroupByAdmin(personalNumber);
};

export const getAllGroupNamesByAdmin = (personalNumber: string): Promise<Group[]> => {
  log('info', `requested all group names for admin ${personalNumber}`);

  return repository.getAllGroupNamesByAdmin(personalNumber);
};

export default {
  getAll,
  getAllGroupNames,
  getGroupByName,
  addNewGroup,
  addWholeGroup,
  deleteGroup,
  getAllGroupByAdmin,
  getAllGroupNamesByAdmin,
};
