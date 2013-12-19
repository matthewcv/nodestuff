var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function init(app) {


   app.use(passport.initialize());
   app.use(passport.session());

        // Use the GoogleStrategy within Passport.
        //   Strategies in Passport require a `verify` function, which accept
        //   credentials (in this case, an accessToken, refreshToken, and Google
        //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
        clientID: init.GOOGLE_CLIENT_ID,
        clientSecret: init.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:1337/auth/googlecallback"
    },
      function (accessToken, refreshToken, profile, done) {
          // asynchronous verification, for effect...
          process.nextTick(function () {

              // To keep the example simple, the user's Google profile is returned to
              // represent the logged-in user.  In a typical application, you would want
              // to associate the Google account with a user record in your database,
              // and return that user instead.
              return done(null, profile);
          });
      }
    ));
    
}

init.GOOGLE_CLIENT_ID = "311786034318.apps.googleusercontent.com";
init.GOOGLE_CLIENT_SECRET = "Hh6RYdP-0t29907e3J11WKU5";




module.exports = init;


