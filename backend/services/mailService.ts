/* mail srever requests - https://www.getpostman.com/collections/4f84d952c22ed16ce242 */
import https from 'https';
import axios from 'axios';
import { log } from '../logger/logger';
import {
  AssignmentToSave,
  AssignmentMail,
  MailServerResponse,
  MemberAssignment,
  MailInfo,
  Mail,
} from '../DALs/mailDAL';
import {
  isDailyMissionToSaveWithSub,
  isGuardingToSave,
  isWeeklyMissionToSave,
  isWeeklyMissionToSaveWithSub,
} from '../utils/missionUtils';
import { convertGuardingToSave } from '../DALs/guardingDAL';

export const convertToAssignmentMail = (
  subject: string,
  startDate: Date,
  endDate: Date,
  groupMemberId: string,
  location: string,
  assignment: AssignmentToSave
): AssignmentMail => ({
  groupMemberId,
  assignment,
  mail: convertToMail(subject, startDate, endDate, groupMemberId, location),
});

export const convertToMail = (
  subject: string,
  startDate: Date,
  endDate: Date,
  groupMemberId: string,
  location: string
): Mail => ({
  subject,
  content: '<html><body><h1></h1></body></html>',
  startDate,
  endDate,
  attendees: [`u${groupMemberId}@${process.env.OUTLOOK_DOMAIN}`],
  location,
  userCredentials: {
    username: process.env.OUTLOOK_SERVICE_USERNAME,
    password: process.env.OUTLOOK_SERVICE_PASSWORD,
  },
});

const getMailsInfo = (batches: MailServerResponse[]): MailInfo[] =>
  batches.flatMap((batch, index): MailInfo[] =>
    batch.responses.map((eventRes) => ({
      index: parseInt(eventRes.id) + 4 * index - 1,
      eventId: eventRes.body.id,
    }))
  );

export const getAssignmentToSave = (
  assignmentMail: AssignmentMail,
  mailInfo: MailInfo
): MemberAssignment => {
  const event = isDailyMissionToSaveWithSub(assignmentMail.assignment)
    ? assignmentMail.assignment.subMissions.find(
        (mission) => mission.description === assignmentMail.mail.subject
      )
    : !isWeeklyMissionToSave(assignmentMail.assignment)
    ? isGuardingToSave(assignmentMail.assignment)
      ? (assignmentMail.assignment = convertGuardingToSave(
          assignmentMail.assignment.description,
          assignmentMail.assignment.startDate,
          assignmentMail.assignment.endDate,
          mailInfo.eventId,
          assignmentMail.mail.location
        ))
      : (assignmentMail.assignment.eventId = mailInfo.eventId)
    : isWeeklyMissionToSaveWithSub(assignmentMail.assignment)
    ? assignmentMail.assignment.events.find(
        (mission) =>
          mission.description === assignmentMail.mail.subject &&
          mission.date.getDay() === assignmentMail.mail.startDate.getDay()
      )
    : assignmentMail.assignment.events.find(
        (mission) => mission.date.getDay() === assignmentMail.mail.startDate.getDay()
      );
  return {
    groupMemberId: assignmentMail.groupMemberId,
    assignment: assignmentMail.assignment,
  };
};

export const getAssignmentsToSave = (
  assignmentMails: AssignmentMail[],
  mailsInfo: MailInfo[]
): MemberAssignment[] =>
  mailsInfo.map((mail) => {
    return getAssignmentToSave(assignmentMails[mail.index], mail);
  });

export const sendMails = async (mails: Mail[]): Promise<MailInfo[]> => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const batches: MailServerResponse[] = (
      await axios.post(`${process.env.OUTLOOK_SERVICE_URL}/events/send-multiple`, mails, {
        httpsAgent: agent,
      })
    ).data;
    return getMailsInfo(batches);
  } catch (error) {
    log('error', 'faild to send mails', error);
    throw error;
  }
};

export const updateMail = async (
  eventId: string,
  newStartDate: Date,
  newEndDate: Date
): Promise<void> => {
  try {
    await axios.patch(`${process.env.OUTLOOK_SERVICE_URL}/events/update`, {
      eventId,
      newStartDate,
      newEndDate,
      userCredentials: {
        username: process.env.OUTLOOK_SERVICE_USERNAME,
        password: process.env.OUTLOOK_SERVICE_PASSWORD,
      },
    });
  } catch (error) {
    log('error', 'faild to update mail', error);
    throw error;
  }
};

export const deleteMail = async (eventId: string): Promise<void> => {
  try {
    await axios.post(`${process.env.OUTLOOK_SERVICE_URL}/events/cancel`, {
      comment: 'הזימון התבטל',
      eventId,
      userCredentials: {
        username: process.env.OUTLOOK_SERVICE_USERNAME,
        password: process.env.OUTLOOK_SERVICE_PASSWORD,
      },
    });
  } catch (error) {
    log('error', 'faild to cancel mail', error);
    throw error;
  }
};
