const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const TwitterStrategy = require('passport-twitter');
const LocalStrategy = require('passport-local');
const keys = require('./keys');
const Student = require('../models/student');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  // Look up DB for a Student with exact ID
  Student.findById(id).then((user) => {
    done(null, user);
  });
});

// GOOGLE STRATEGY
// User will have to provide email verification
passport.use(
  new GoogleStrategy({
    // options for the strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        // if user already exists
        console.log('user already exists: ' + currentUser);
        done(null, currentUser);
      } else {
        // if user does not exist, add to db
        new Student({
          name: profile.displayName,
          googleId: profile.id,
          thumbnail: profile._json.image.url
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  })
);

// FACEBOOK STRATEGY
passport.use(
  new FacebookStrategy({
    // options for the strategy
    callbackURL: '/auth/facebook/callback',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: keys.facebook.callbackURL,
    profileFields: keys.facebook.profileFields
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({facebookId: profile.id}).then((currentUser) => {
      if(currentUser) {
        // if user already exists
        console.log('user already exists: ' + currentUser);
        done(null, currentUser);
      } else {
        // if user does not exist, add to db
        new Student({
          name: profile.displayName,
          facebookId: profile.id,
          username: profile.emails[0].value,
          thumbnail: 'https://graph.facebook.com/' + profile.id + '/picture?type=large'
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  })
);

// TWITTER STRATEGY
// User will have to provide email verification
passport.use(
  new TwitterStrategy({
    // options for the strategy
    callbackURL: '/auth/twitter/callback',
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret,
    callbackURL: keys.twitter.callbackURL
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    Student.findOne({twitterId: profile.id}).then((currentUser) => {
      if(currentUser) {
        // if user already exists
        console.log('user already exists: ' + currentUser);
        done(null, currentUser);
      } else {
        // if user does not exist, add to db
        new Student({
          name: profile.displayName,
          twitterId: profile.id,
          thumbnail: profile._json.profile_image_url
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
        });
      }
    });
  })
);

// LOCAL STRATEGY FOR LOGIN
passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    console.log(password);
    Student.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      if(user) {
        if(user.password != password) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      } else {
        return done(null, false, { message: 'Incorrect username.' });
      }
    });
  }
));
