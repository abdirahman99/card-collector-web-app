const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const { User } = require("./src/db/mongoose");
passport.use(
  new LocalStrategy(function (username, password, callback) {
    User.findOne(
      {
        username: username,
      },
      function (err, doc) {
        if (err) {
          callback(err, null);
        }
        if (!doc) {
          callback(null, null, { message: "User Not Registered" });
        } else if (doc.password !== password) {
          callback(null, null, { message: "Incorrect Password" });
        } else {
          callback(null, doc, { message: "Login Successful" });
        }
      }
    );
  })
);

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    function (jwtPayload, callback) {
      if (jwtPayload) {
        callback(null, jwtPayload);
      } else {
        callback(new Error("User Not Authenticated"));
      }
    }
  )
);
