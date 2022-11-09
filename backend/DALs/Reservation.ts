import { ObjectID } from 'bson';
import mongoose from 'mongoose';

export interface Reservation {
  _id: ObjectID | string;
  startTime: Date;
  endTime: Date;
  date: Date;
  description: string;
  [key: string]: string | Date | ObjectID;
}

export const ReservationSchema = new mongoose.Schema({
  _id: ObjectID,
  startTime: Date,
  endTime: Date,
  date: Date,
  description: String,
});
