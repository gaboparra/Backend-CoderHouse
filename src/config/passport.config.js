import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    },
        async (req, username, password, done) => {
            const { first_name, last_name, age, email } = req.body;
            try {
                const user = await UserModel.findOne({ email: username });
                if (user) {
                    console.log("User already exists");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email,
                    password: createHash(password),
                };
                const result = await UserModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("error when registering " + error);
            }
        }
    )
    );

    passport.use("login", new LocalStrategy({
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
        }
    )
    );

    // Github
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.eeeb3b341665af45",
        clientSecret: "ca5bed6c47823c493d0fce31dbec4dab418b89ec",
        callbackURL: "http://localhost:8080/githubcallback",
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try {
                const user = await UserModel.findOne({ email: profile._json.email });
                if (user) {
                    console.log("It is already registered.");
                    return done(null, user);
                }
                const newUser = await UserModel.create({
                    first_name: profile._json.name || "",
                    last_name: profile._json.last_name || "",
                    age: profile._json.age || null,
                    email: profile._json.email || "",
                    password: profile._json.password || null,
                });

                return done(null, newUser);
            } catch (error) {
                return done("error when logging in Github " + error);
            }
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
