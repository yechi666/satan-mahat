export interface Months {
  hebrew: string;
  english: string;
}

export const daysNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export const monthsNames = [
  {
    hebrew: 'ינואר',
    english: 'January ',
  },
  {
    hebrew: 'פברואר',
    english: 'February',
  },
  {
    hebrew: 'מרץ',
    english: 'March',
  },
  {
    hebrew: 'אפריל',
    english: 'April',
  },
  {
    hebrew: 'מאי',
    english: 'May',
  },
  {
    hebrew: 'יוני',
    english: 'June',
  },
  {
    hebrew: 'יולי',
    english: 'July',
  },
  {
    hebrew: 'אוגוסט',
    english: 'August',
  },
  {
    hebrew: 'ספטמבר',
    english: 'September',
  },
  {
    hebrew: 'אוקטובר',
    english: 'October',
  },
  {
    hebrew: 'נובמבר',
    english: 'November',
  },
  {
    hebrew: 'דצמבר',
    english: 'December',
  },
] as Months[];

export interface Week {
  firstDay: Date;
  lastDay: Date;
  display: string;
}

const dayMili = 86400000;
const weekMili = dayMili * 7;

const getWeekDisplay = (firstDay: Date, lastDay: Date): string => {
  if (firstDay.getFullYear() === lastDay.getFullYear()) {
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${
        monthsNames[firstDay.getMonth()].english
      } ${firstDay.getDate()}-${lastDay.getDate()}, ${firstDay.getFullYear()}`;
    }
    return `${monthsNames[firstDay.getMonth()].english} ${firstDay.getDate()} - ${
      monthsNames[lastDay.getMonth()].english
    } ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
  }
  return `${
    monthsNames[firstDay.getMonth()].english
  } ${firstDay.getDate()} ${firstDay.getFullYear()} - ${
    monthsNames[lastDay.getMonth()].english
  } ${lastDay.getDate()} ${lastDay.getFullYear()}`;
};

export const getCurrWeek = (): Week => {
  const today = new Date();
  const first = today.getDate() - today.getDay();
  const last = first + 6;
  const firstDay = new Date(today.setDate(first));
  const lastDay = new Date(today.setDate(last));

  return {
    firstDay,
    lastDay,
    display: getWeekDisplay(firstDay, lastDay),
  };
};

export const getNextWeek = (currWeek: Week): Week => {
  const firstDay = new Date(currWeek.firstDay.getTime() + weekMili);
  const lastDay = new Date(currWeek.lastDay.getTime() + weekMili);

  return {
    firstDay,
    lastDay,
    display: getWeekDisplay(firstDay, lastDay),
  };
};

export const getLastWeek = (currWeek: Week): Week => {
  const firstDay = new Date(currWeek.firstDay.getTime() - weekMili);
  const lastDay = new Date(currWeek.lastDay.getTime() - weekMili);

  return {
    firstDay,
    lastDay,
    display: getWeekDisplay(firstDay, lastDay),
  };
};

export const getWeekDates = (firstDay: Date): Date[] => {
  const dates = [] as Date[];

  for (let index = 0; index < 7; index += 1) {
    dates.push(new Date(firstDay.getTime() + index * dayMili));
  }

  return dates;
};

export const filterWeekDates = (week: Date[], days: number[] | undefined): (Date | undefined)[] => {
  if (days) {
    return week.map((day, index): Date | undefined => {
      if (days.includes(index + 1)) {
        return day;
      }

      return undefined;
    });
  }

  return week;
};
