var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// var portNumber  = process.env.PORT || 9000;
var portNumber  = 9000;
app.listen(portNumber, () => {
    console.log(app.settings.env, 'envir');
});


// const mongoDbURL = 'mongodb+srv://amitwohlig:Zoro@9594@cluster0.si5nno7.mongodb.net/'
const mongoDbURL = 'mongodb+srv://amitwohlig:Zoro%409594@cluster0.si5nno7.mongodb.net/admin?authSource=admin&replicaSet=atlas-oa4hsi-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
// mongodb+srv://amitwohlig:<password>@cluster0.si5nno7.mongodb.net/
const mongoDbLocalURL = 'mongodb://localhost:27017/taxi-back'

const mongoConnection = mongoose.connect( mongoDbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoConnection.then(dbResponse => {
    console.log(dbResponse, 'connected');
    database = dbResponse;
}, error => {
    console.log(error, 'Error connecting');
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// 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
// mongodb+srv://amitwohlig:Zoro@9594@cluster0.si5nno7.mongodb.net/

module.exports = app;
