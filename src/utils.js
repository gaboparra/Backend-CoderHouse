import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const PRIVATE_KEY = "CoderHouse_Secret";

// Crear Hash
export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar Hash
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

// Generar Token
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });

  return token;
};

// Autenticación Token
export const authToken = (req, res, next) => {
  const token = req.headers.auth;
  if (!token) return res.status(401).send({ error: "Not authorized." });

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authorized." });

    req.user = credentials.user;
    next();
  });
};
