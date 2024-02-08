import nodemailer from "nodemailer";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const MailingCtrl = {};

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.user,
    pass: config.GMAIL_KEY,
  },
});

MailingCtrl.sendMail = async (req, res) => {
  try {
    const result = await transport.sendMail({
      from: config.user,
      to: config.user,
      subject: "Mailing Test.",
      html: ``,
    });

    console.log(result);
    res.send("Email Sent.");
  } catch (error) {
    logger.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
};

export default MailingCtrl;
