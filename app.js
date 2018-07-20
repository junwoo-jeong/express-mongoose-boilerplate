// import express and middleware modules
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// import mongoDB modules
import mongoose from 'mongoose';

// import routes modules
import routes from './routes';
import { authMiddleware } from './middleware/auth';

const app = express();

// connect mongoDB
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('connected to mongod server');
});
mongoose.connect(process.env.DB_URI);

// set Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// set path
app.use(express.static(path.join(__dirname, 'public')));

// set route
app.use('/', routes);

app.use('/test', authMiddleware);
app.get('/test', (req, res) => {
  console.log('유저 검증 완료!');
  res.send("asdasdas");
  res.end();
})
module.exports = app;
