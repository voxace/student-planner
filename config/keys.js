// add this file to .gitignore

module.exports = {
  google: {
    clientID: '34674122778-rvf2657hjdrk188jt2l6epcdo9fcm7ia.apps.googleusercontent.com',
    clientSecret: 'HsT89NG1El8UYahivoZ8VxkK'
  },
  facebook: {
    clientID: '1470431146343754',
    clientSecret: 'c8d85a0368b4240be3f674c6b9e8c109',
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'emails', 'name']
  },
  twitter: {
    consumerKey: 'vm7E3Xnflt5Yo4kqi62UcvYcu',
    consumerSecret: 'pO5WJUy6ziqpB3kFLU4eOHalsOQZKjejbVKia2iFFRuoiV2LnR'
  },
  mongodb: {
    dbURI: 'mongodb://user:pass@ds261755.mlab.com:61755/students'
  },
  session: {
    cookieKey: 'DaveIsAwesome'
  }
}
