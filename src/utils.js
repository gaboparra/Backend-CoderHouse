import config from "./config/config.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import logger from "./utils/logger.js";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// Crear HASH
export const createHash = (password) => {
  try {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  } catch (error) {
    logger.error("Error when creating hash:", error);
  }
};

// Validar HASH
export const isValidPassword = (user, password) => {
  try {
    return bcrypt.compareSync(password, user.password);
  } catch (error) {
    logger.error("Error when validating password:", error);
    return false;
  }
};

// JWT
export const generateToken = (user) => {
  try {
    return jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: "24h" });
  } catch (error) {
    logger.error("Error when generating token:", error);
  }
};

// Autenticación Token
export const authToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    logger.error("No token provided.");
    return res.status(401).json({ error: "Not authorized." });
  }

  jwt.verify(token, config.PRIVATE_KEY, (error, credentials) => {
    if (error) {
      logger.error("Invalid token:", error);
      return res.status(403).json({ error: "Not authorized." });
    }

    req.user = credentials.user;
    next();
  });
};

//Mock
export const generateProducts = () => {
  try {
    return {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stock: faker.number.int({ max: 100 }),
      imageUrl: faker.image.urlLoremFlickr(),
    };
  } catch (error) {
    logger.error("Error when generating products:", error);
  }
};

// Reset Password
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.user,
    pass: config.GMAIL_KEY,
  },
});

export const sendInactiveUserEmail = async (email) => {
  try {
    const mailOptions = {
      from: config.user,
      to: email,
      subject: "Eliminación de cuenta por inactividad",
      text: "Tu cuenta ha sido eliminada debido a inactividad.",
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetLink = `http://localhost:8080/reset-password/${token}`;
    const mailOptions = {
      from: config.user,
      to: email,
      subject: "Password recovery",
      text: `Click the link below to reset your password: ${resetLink}`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending password reset email:", error);
  }
};
