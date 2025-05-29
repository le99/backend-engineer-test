var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { pool } = require('./db/postgresql');

var expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);

var authRouter = require('./routes/auth');
var appRouter = require('./routes/app');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');

const helmet = require('helmet');
const csrfUtilities = require('./csrf/csrfConfig');

var app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "cdn.jsdelivr.net"],
    },
  },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(expressSession({
  store: new pgSession({
    pool: pool,                // Connection pool
    tableName: 'session'   // Use another table-name than the default "session" one
    // Insert connect-pg-simple options here
  }),
  secret: process.env.FOO_COOKIE_SECRET,
  resave: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }, // 30 days

  // Insert express-session options here
  saveUninitialized: false,
  name: 'sessionId',
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', authRouter);
app.use('/', appRouter);
app.use('/api/user', userRouter);

app.get('/health-check', (req, res) => {
  res.json({ msg: 'ok' });
});


app.use(csrfUtilities.csrfSynchronisedProtection);
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
