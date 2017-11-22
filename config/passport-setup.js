const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const TwitterStrategy = require('passport-twitter');
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
          username: profile.displayName,
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
          username: profile.displayName,
          facebookId: profile.id,
          email: profile.emails[0].value,
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
          username: profile.displayName,
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
