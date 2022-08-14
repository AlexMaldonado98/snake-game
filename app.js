const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const config = require('./utils/config');
const logger = require('./utils/logger');
const MONGODB_URI = config.MONGODB_URI;
const scoresRouter = require('./controllers/scores');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const loginRouter = require('./controllers/login');
morgan.token('data', (request) => request.method === 'POST' ? JSON.stringify(request.body) : '' );

logger.info('connecting to mongodb');

mongoose.connect(MONGODB_URI)
    .then(() => logger.info('connected to mongodb'))
    .catch(() => logger.error('[ERROR] when trying to connect to mongodb..') );

app.use(cors());
app.use(express.json(0));
app.use(morgan(':method :url :status :response-time ms :data'));

app.use(middleware.tokenExtractor);

app.use(express.static('build'));

app.use('/api/scores',scoresRouter);
app.use('/api/users',usersRouter);
app.use('/api/login',loginRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);



module.exports = app;