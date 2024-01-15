import passport from "passport";
import passportJWT from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy(
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
                console.error("Error when registering:", error);
                return done("Error when registering", false, { message: "Error when registering", });
            }
        }));

    passport.use("login", new LocalStrategy(
        {
            usernameField: "email",
        },
        async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username }).lean().exec();
                if (!user) {
                    console.error("Username does not exist");
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.error("Invalid password");
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done("error when logging in " + error);
            }
        }));

    // Github
    passport.use("github", new GitHubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await UserModel.findOne({ email: profile._json.email });
                if (!user) {
                    console.log("User doesn't exist. Pass to register...");

                    user = {
                        first_name: profile._json.name,
                        last_name: profile._json.last_name || "Github Last Name",
                        age: profile._json.age || null,
                        email: profile._json.email,
                        cart: null,
                        role: "user",
                    };

                    const result = await UserModel.create(user);
                    console.log("User registered succesfully.");

                    user._id = result._id;
                }

                const token = generateToken(user);
                user.token = token;

                return done(null, user);
            } catch (error) {
                console.error(error);
                return done("[GITHUB] " + error);
            }
        }));

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
                (req) => req?.cookies?.cookieJWT ?? null,
            ]),
            secretOrKey: process.env.PRIVATE_KEY,
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
