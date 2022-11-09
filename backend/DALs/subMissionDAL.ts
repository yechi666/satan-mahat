import mongoose from 'mongoose';

export interface SubMission extends mongoose.Document {
  description: string;
  place: string;
  date: string;
  startTime: string;
  endTime: string;
  days: number[];
}

export const SubMissionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  place: { type: String },
  date: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  days: [{ type: Number }],
});

export default mongoose.model<SubMission>('SubMission', SubMissionSchema);
