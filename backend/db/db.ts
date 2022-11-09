import mongoose from 'mongoose';
import { log } from '../logger/logger';

export default () => {
  mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
      if (!err) {
        console.log('connected to db');
        log('info', 'connected to db', this);
      } else {
        log('error', 'could not connect to db', this, `${JSON.stringify(err)}`);
      }
    }
  );

  if (process.env.NODE_ENV === 'dev') {
    mongoose.set('debug', true);
  }
};
