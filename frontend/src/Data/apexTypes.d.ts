import { TypeFlags } from 'typescript';

type chartContextType = {
  hideSeries(name: string): null;
};

type configType = {
  config: {
    series: [seriesItem];
  };
};

type seriesItemType = {
  name: string;
};

type seriesType = {
  data: number[];
  name: string;
};

type memberGuardingType = {
  _id: string;
  totalHours: number;
};

type memberAssignmentType = {
  _id: string;
  countMissions: number;
  name: string;
};
