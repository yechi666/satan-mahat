import { Mission } from './Missions';

export interface Member {
  name: string;
  personalNumber: string;
}

export interface FullMember {
  name: string;
  personalNumber: string;
  missions: Mission[];
}
