import { FullMember } from './Members';
import { Mission } from './Missions';

export interface Group {
  name: string;
  missionsStructure: Mission[];
  members: FullMember[];
  oceanGroupId: string;
  _id: string;
  manager?: string;
}
