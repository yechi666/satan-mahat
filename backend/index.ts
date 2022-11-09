import express from 'express';
import { log } from './logger/logger';
import memberRouter from './routers/memberRouter';
import missionRouter from './routers/missionRouter';
import missionStructureRouter from './routers/missionStructureRouter';
import groupRouter from './routers/groupRouter';
import db from './db/db';

// Create a .env.*** for each NODE_ENV
require('custom-env').env(true);

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var http = require('http');
var app = express();

app.use(cors());
app.use(express.json());
db();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/members', memberRouter);
app.use('/missions', missionRouter);
app.use('/missionsStructure', missionStructureRouter);
app.use('', groupRouter);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);

log('info', `server running on port ${port}`, this);
console.log(`satan fucking server listening on port: ${port}`);

function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
