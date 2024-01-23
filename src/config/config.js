import dotenv from "dotenv";

dotenv.config();
export default {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT,
  mongoURL: process.env.MONGO_URL,
  mongoDBName: process.env.MONGO_DB_NAME,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  user: process.env.USER,
  GMAIL_KEY: process.env.GMAIL_KEY,
};
