global.__basedir = __dirname;
global.__downloading = [];
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// const config=require('./tytubka.config');
// var indexRouter = require('./routes/index');
var infoRouter = require('./routes/info');
var downloadRouter = require('./routes/download');
const listRouter = require('./routes/list');
const sendFileRouter = require("./routes/sendfile");
const deleteRouter = require("./routes/delete");
const cancelRouter = require("./routes/cancel");
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

var mountedRouter = express.Router();
app.use(mountedRouter)
// make MOUNT_PATH know to the whole response (views, etc.)

const apiRouter = express.Router();
mountedRouter.use('/api', apiRouter);
apiRouter.use('/', require('./routes/api'));
// apiRouter.use('/info',require('./routes/api/info'));
// mount the whole router on MOUNT_PATH || "/" 
mountedRouter.use(express.static(path.join(__dirname, 'client', 'dist')));
mountedRouter.use('/', require('./routes/index'));
mountedRouter.use('/info', infoRouter);
mountedRouter.use('/download', downloadRouter);
mountedRouter.use('/list', listRouter)
mountedRouter.use('/sendfile', sendFileRouter);
mountedRouter.use('/delete', deleteRouter);
mountedRouter.use('/cancel', cancelRouter)
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