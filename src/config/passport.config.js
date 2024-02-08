import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import config from "./config.js";
import logger from "../utils/logger.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const initializePassport = () => {
  passport.use('register', new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age, email } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            return done(null, false, { message: "User already exists" });
          }

          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            cart: null,
            role: "user",
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          logger.error("Error when registering:", error);
          return done("Error when registering", false, { message: "Error when registering" });
        }
      }
    )
  );

  passport.use('login', new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username }).lean().exec();
          if (!user) {
            logger.error("Username does not exist");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            logger.error("Invalid password");
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          logger.error("Error when logging in:", error);
          return done("error when logging in " + error);
        }
      }
    )
  );

  // Github
  passport.use('github', new GitHubStrategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            logger.info("User doesn't exist. Pass to register...");

            user = {
              first_name: profile._json.name,
              last_name: profile._json.last_name || "Github Last Name",
              age: profile._json.age || null,
              email: profile._json.email,
              cart: null,
              role: "user",
            };

            const result = await UserModel.create(user);
            logger.info("User registered successfully.");

            user._id = result._id;
          }

          const token = generateToken(user);
          user.token = token;

          return done(null, user);
        } catch (error) {
          logger.error("[GITHUB]", error);
          return done("[GITHUB] " + error);
        }
      }
    )
  );

  passport.use('jwt', new JWTStrategy(
      {
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
          (req) => req?.cookies?.cookieJWT ?? null,
        ]),
        secretOrKey: config.PRIVATE_KEY,
      },
      (jwt_payload, done) => {
        done(null, jwt_payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
