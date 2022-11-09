import mongoose from 'mongoose';
import { ObjectID } from 'bson';
import { Member, MemberSchema } from './memberDAL';
import { Mission, MissionSchema } from './missionDAL';

export interface Group extends mongoose.Document {
  _id: ObjectID;
  name: string;
  missionsStructure: Mission[];
  members: Member[];
  oceanGroupId: string;
}

export const GroupSchema = new mongoose.Schema(
  {
    _id: ObjectID,
    name: { type: String, required: true, unique: true },
    missionsStructure: [MissionSchema],
    members: [MemberSchema],
    oceanGroupId: { type: String, required: true },
  },
  { collection: 'Group' }
);

export default mongoose.model<Group>('Group', GroupSchema);
