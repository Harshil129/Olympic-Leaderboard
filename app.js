var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Import mongoose
var mongoose = require('mongoose');
var config = require('./config/globals');

//Import passport and session modules
var passport = require('passport');
const githubStrategy = require('passport-github2').Strategy;
var session = require('express-session');
var User = require('./models/user');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var countriesRouter = require('./routes/countries');
var eventsRouter = require('./routes/events');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// even if it's never modified during the request
app.use(session({
  secret: '0lympicLeaderboard',
  resave: false,
  saveUninitialized: false
}));

//before the route declarations
app.use(passport.initialize());
app.use(passport.session());

// Link passport to the user model
passport.use(User.createStrategy());

// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure passport-github2 with the API keys and user model
// We need to handle two scenarios: new user, or returning user
passport.use(new githubStrategy({
  clientID: config.github.clientId,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackUrl
},
  // create async callback function
  // profile is github profile
  async (accessToken, refreshToken, profile, done) => {
    // search user by ID
    const user = await User.findOne({ oauthId: profile.id });
    // user exists (returning user)
    if (user) {
      // no need to do anything else
      return done(null, user);
    }
    else {
      // new user so register them in the db
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'Github',
        created: Date.now()
      });
      // add to DB
      const savedUser = await newUser.save();
      // return
      return done(null, savedUser);
    }
  }
));

//route declarations
app.use('/', indexRouter);
app.use('/countries', countriesRouter);
app.use('/events', eventsRouter);

//Configure mongoose after route declarations
//let connStr = 'mongodb+srv://Harshil:MongoDB123@js.r2whw.mongodb.net/Harshil';
mongoose.connect(config.db, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((message) => console.log('Connected Succesfully'))
  .catch((error) => console.log(error))

  const hbs = require('hbs');
  
  // function name and helper function with parameters
  hbs.registerHelper('createOption', (currentValue, selectedValue) => {
  
  // initialize selected property
  var selectedProperty = '';
  
  // if values are equal set selectedProperty accordingly
  if (currentValue == selectedValue) {
    selectedProperty = 'selected';
  }
  
  // return html code for this option element
  // return new hbs.SafeString('<option '+ selectedProperty +'>' + currentValue + '</option>');
  return new hbs.SafeString(`<option ${selectedProperty}>${currentValue}</option>`);
  });

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
