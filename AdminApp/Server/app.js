
var cors = require("cors");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var faceIdRouter = require('./routes/faceId')
var authLogsRouter = require('./routes/authlogs')
var {createCollection} = require("./util/rekognition")
require('dotenv').config()

var app = express();

//Local Variables
app.locals.cameraIP = '';

//MongoDB Connection

const connectDB = require('./db/dbconfig')
connectDB();

const AuthLog = require('./db/models/AuthLog')

//Temporarily allow from any ip for dev purposes
app.use(cors());

// view engine setup

app.use(logger('dev'));
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ extended: false,limit:'10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/faceId',faceIdRouter);
app.use('/logs',authLogsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (JSON only, no view engine)
app.use(function(err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    // only expose stack in development
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});




//AWS 


//collection is students
// try{
//   createCollection('students')
// }catch(err){
//   console.error("Error With Collection Init: ", err.response?.message)
// }
module.exports = app;
