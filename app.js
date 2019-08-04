global.__basedir = __dirname;
global.__downloading = [];
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(require('body-parser').json())
app.use(cookieParser());
app.use(require('cors')())
app.use( (req,res,next)=>{
  if (req.query.id_token){
    console.log("TOKEN detected!")
    //authenticate token here
  }
  next();
})
const apiRouter = express.Router();
app.use('/api', apiRouter);
app.use('/auth',require('./routes/google-verify'));
apiRouter.use('/', require('./routes/api'));
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;