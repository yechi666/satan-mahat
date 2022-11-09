const fetch = require('node-fetch');
const DEV_LOG_INDEX = 'satan-dev';
export const log = (level: string, message: string, ...logData: any) => {
  // const INDEX_NAME = process.env.LOG_INDEX_NAME || DEV_LOG_INDEX;
  // fetch(process.env.LOGGER_URL + INDEX_NAME + '/logs', {
  //   headers: {
  //     Authorization: 'Basic ZWxhc3RpYzpUMHZhbEwwZ3Mh',
  //     'Content-Type': 'application/json',
  //   },
  //   method: 'POST',
  //   body: JSON.stringify({
  //     level,
  //     message,
  //     logData: { ...logData },
  //     timeStamp: new Date(),
  //   }),
  // }).catch((error: Error) => {
  //   console.error('Error:', error);
  // });
  console.log(level + '\n' + message + '\n' + JSON.stringify(logData));
};
