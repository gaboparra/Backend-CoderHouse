import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Crear HASH
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar HASH
export const isValidPassword = (user, password) => {
  try {
    return bcrypt.compareSync(password, user.password);
  } catch (error) {
    console.error("Error when validating password:", error);
    return false;
  }
};

// JWT
export const generateToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
};

// Autenticación Token
export const authToken = (req, res, next) => {
  const token = req.headers.auth;
  if (!token) return res.status(401).json({ error: "Not authorized." });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).json({ error: "Not authorized." });

    req.user = credentials.user;
    next();
  });
};
