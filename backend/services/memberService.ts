import { log } from '../logger/logger';
import repository from '../repositories/memberRepository';
import { Member } from '../DALs/memberDAL';
import { Group } from '../DALs/groupDAL';
import { Reservation } from '../DALs/Reservation';

export const getMembersByGroup = (groupName: string): Promise<Group[]> => {
  log('info', 'requested all members in group', { groupName });

  return repository.getMembersByGroup(groupName);
};

export const getMemberByPerNum = (
  groupName: string,
  personalNumber: string
): Promise<Member> => {
  log('info', 'requested all detatils on specific member in group by personal numeber', {
    groupName,
    personalNumber,
  });

  return repository.getMemberByPerNum(groupName, personalNumber);
};

export const getMemberByName = (groupName: string, memberName: string): Promise<Group[]> => {
  log('info', 'requested all detatils on specific member in group by name', {
    groupName,
    memberName,
  });

  return repository.getMemberByName(groupName, memberName);
};

export const getAllMembers = (): Promise<Group[]> => {
  log('info', 'requested all members in the system', {});
  return repository.getAllMembers();
};

export const addMemberToGroup = (groupName: string, member: Member): Promise<Group> => {
  log('info', 'tried to add member to group', { groupName, member });

  return repository.addMemberToGroup(groupName, member);
};

export const removeMemberFromGroup = (groupName: string, member: Member): Promise<Group> => {
  log('info', 'tried to remove member to group', { groupName, member });

  return repository.removeMemberFromGroup(groupName, member);
};

export const updateReservation = (
  groupName: string,
  personalNumber: string,
  reservation: Reservation
) => {
  log('info', 'update reservation to member', { groupName, personalNumber, reservation });

  const isDeleted =  repository.updateReservation(groupName, personalNumber, reservation);

  if (!isDeleted) {
    throw Error('error updating reservation');
  }
};

export const deleteReservation = (groupName: string, personalNumber: string, id: string) => {
  log('info', 'update reservation to member', { groupName, personalNumber, id });
  console.log({ groupName, personalNumber, id });

  const isDeleted = repository.deleteReservation(groupName, personalNumber, id);

  if (!isDeleted) {
    throw Error('error deleting reservation');
  }
};

export const addReservation = (
  groupName: string,
  personalNumber: string,
  reservation: Reservation
): Promise<Reservation[]> => {
  log('info', 'adding reservation to member', { groupName, personalNumber, reservation });

  return repository.addReservation(groupName, personalNumber, reservation);
};

export const getAllReservations = async (
  groupName: string,
  personalNumber: string
): Promise<Reservation[]> => {
  log('info', 'get reservations of member', { groupName, personalNumber });

  return await repository.getAllReservations(groupName, personalNumber);
};

export default {
  deleteReservation,
  getAllReservations,
  updateReservation,
  addReservation,
  getMembersByGroup,
  getMemberByPerNum,
  getMemberByName,
  getAllMembers,
  addMemberToGroup,
  removeMemberFromGroup,
};
