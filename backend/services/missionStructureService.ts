import { Group } from '../DALs/groupDAL';
import { Mission } from '../DALs/missionDAL';
import { log } from '../logger/logger';
import repository from '../repositories/missionStructureRepository';

export const getGroupMissionStructure = (
  groupName: string
): Promise<Group[]> => {
  log('info', 'requested all mission structures of group', { groupName });

  return repository.getGroupMissionStructure(groupName);
};

export const getGroupMissionStructureByType = (
  groupName: string,
  type: string
): Promise<Group[]> => {
  log('info', 'requested all mission structures of specific type in group', {
    groupName,
    type,
  });

  return repository.getGroupMissionStructureByType(groupName, type);
};

export const addMissionStructureToGroup = (
  groupName: string,
  missionStructure: Mission
): Promise<Group> => {
  log('info', 'tried to add mission structure to group', {
    groupName,
    missionStructure,
  });

  return repository.addMissionStructureToGroup(groupName, missionStructure);
};

export default {
  getGroupMissionStructure,
  getGroupMissionStructureByType,
  addMissionStructureToGroup,
};
