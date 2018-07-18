// import express and middleware modules
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// import mongoDB modules
import mongoose from 'mongoose';

// import routes modules
import routes from './routes';

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

// set path
app.use(express.static(path.join(__dirname, 'public')));

// set route
app.use('/', routes);
app.get('/test', (req, res) => {
  res.json({
    success: "asd"
  });
});

module.exports = app;
