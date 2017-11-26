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
  Student.findById(id).then((user) => {
    done(null, user);
  });
});

// GOOGLE STRATEGY
// User will have to provide email verification
passport.use('google-register',
  new GoogleStrategy({
    callbackURL: '/auth/google/register/callback',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        return done(null, false, { message: 'User already exists, try logging in.' });
      } else {
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

passport.use('google-login',
  new GoogleStrategy({
    callbackURL: '/auth/google/login/callback',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        done(null, currentUser);
      } else {
        done(null,null);
      }
    });
  })
);

// FACEBOOK STRATEGY
passport.use('facebook-login',
  new FacebookStrategy({
    callbackURL: '/auth/facebook/login/callback',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: keys.facebook.profileFields
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({facebookId: profile.id}).then((currentUser) => {
      if(currentUser) {
        done(null, currentUser);
      } else {
        done(null,null);
      }
    });
  })
);

passport.use('facebook-register',
  new FacebookStrategy({
    callbackURL: '/auth/facebook/register/callback',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: keys.facebook.profileFields
  }, (accessToken, refreshToken, profile, done) => {
    Student.findOne({facebookId: profile.id}).then((currentUser) => {
      if(currentUser) {
        return done(null, false, { message: 'User already exists, try logging in.' });
      } else {
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
passport.use('twitter-login',
  new TwitterStrategy({
    callbackURL: '/auth/twitter/login/callback',
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    Student.findOne({twitterId: profile.id}).then((currentUser) => {
      if(currentUser) {
        done(null, currentUser);
      } else {
        done(null,null);
      }
    });
  })
);

passport.use('twitter-register',
  new TwitterStrategy({
    callbackURL: '/auth/twitter/register/callback',
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    Student.findOne({twitterId: profile.id}).then((currentUser) => {
      if(currentUser) {
        return done(null, false, { message: 'User already exists, try logging in.' });
      } else {
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
