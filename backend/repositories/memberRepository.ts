import { Reservation, ReservationSchema } from '../DALs/Reservation';
import GroupSchema, { Group } from '../DALs/groupDAL';
import { Member } from '../DALs/memberDAL';
import { Types, UpdateQuery } from 'mongoose';
import { ObjectID } from 'bson';
import { UpdatedMetadata } from '../types/mongoose';

export const getMembersByGroup = (groupName: string): Promise<Group[]> =>
  GroupSchema.find({ name: groupName }).select('-_id members').exec();

export const getMemberByPerNum = async (
  groupName: string,
  personalNumber: string
): Promise<Member> => {
  const [{ member }] = await GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    { $match: { 'members.personalNumber': personalNumber } },
    { $project: { member: '$members', _id: 0 } },
  ]).exec();

  return member;
};

export const getMemberByName = (groupName: string, memberName: string): Promise<Group[]> =>
  GroupSchema.find({ name: groupName }, { members: { $elemMatch: { name: memberName } } })
    .select('-_id')
    .exec();

export const getAllMembers = (): Promise<Group[]> =>
  GroupSchema.aggregate([
    {
      $group: {
        _id: 'members',
        members: { $push: '$members' },
      },
    },
    {
      $project: {
        members: {
          $reduce: {
            input: '$members',
            initialValue: [],
            in: { $setUnion: ['$$value', '$$this'] },
          },
        },
      },
    },
  ]).exec();

export const getAllReservations = async (
  groupName: string,
  personalNumber: string
): Promise<Reservation[]> => {
  type NestedRequestList = { reservation: Reservation }[];

  const reservationList: NestedRequestList = await GroupSchema.aggregate([
    { $match: { name: groupName } },
    { $unwind: '$members' },
    { $match: { 'members.personalNumber': personalNumber } },
    { $project: { member: '$members', _id: 0 } },
    { $unwind: '$member.reservations' },
    { $project: { reservation: '$member.reservations', _id: 1 } },
  ]).exec();

  return reservationList.map((reservation) => reservation.reservation);
};

export const deleteReservation = async (
  groupName: string,
  personalNumber: string,
  id: string
): Promise<boolean> => {
  const updatedMetadata: UpdatedMetadata = await GroupSchema.updateOne(
    { name: groupName },
    { $pull: { 'members.$[member].reservations': { _id: Types.ObjectId(id) } } },
    {
      arrayFilters: [{ 'member.personalNumber': personalNumber }],
    }
  ).exec();

  return updatedMetadata.nModified > 0;
};

export const addReservation = async (
  groupName: string,
  personalNumber: string,
  reservation: Reservation
): Promise<Reservation[]> => {
  const { members }: Group = await GroupSchema.findOneAndUpdate(
    { name: groupName, members: { $elemMatch: { personalNumber } } },
    { $push: { 'members.$.reservations': { _id: Types.ObjectId(), ...reservation } } },
    { lean: true, new: true }
  ).exec();

  return members.find((member: Member) => member.personalNumber === personalNumber)
    .reservations;
};

export const updateReservation = async (
  groupName: string,
  personalNumber: string,
  reservation: Reservation
): Promise<boolean> => {
  const { _id, ...reservationWithoutID } = reservation;

  const updateReservation = Object.keys(reservationWithoutID).reduce(
    (update: { [key: string]: string | Date | ObjectID }, key: string) => {
      if (Object.keys(ReservationSchema.paths).includes(key)) {
        const newKey = `members.$[member].reservations.$[reservation].${key}`;
        update[newKey] = reservation[key];
      }

      return update;
    },
    {}
  );

  const updatedMetadata: UpdatedMetadata = await GroupSchema.updateOne(
    {
      name: groupName,
    },
    {
      $set: updateReservation,
    },
    {
      arrayFilters: [
        { 'member.personalNumber': personalNumber },
        { 'reservation._id': Types.ObjectId(_id as string) },
      ],
    }
  ).exec();

  return updatedMetadata.nModified > 0;
};

export const addMemberToGroup = (groupName: string, member: Member): Promise<Group> =>
  GroupSchema.update({ name: groupName }, { $push: { members: member } });

export const removeMemberFromGroup = (groupName: string, member: Member): Promise<Group> =>
  GroupSchema.update({ name: groupName }, { $pull: { members: member } });

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
