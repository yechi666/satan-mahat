import mongoose from 'mongoose';
import { Mission, MissionSchema } from './missionDAL';
import { Reservation, ReservationSchema } from './Reservation';

export interface Member extends mongoose.Document {
  name: string;
  personalNumber: string;
  reservations: Reservation[];
  assignments: Mission[];
  role?: Number;
}

export const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personalNumber: { type: String, required: true, unique: true },
  reservations: [ReservationSchema],
  assignments: [MissionSchema],
});

export default mongoose.model<Member>('Member', MemberSchema);
