import logger from "../utils/logger.js";

export const authorization = (role) => {
  return async (req, res, next) => {
    try {
      const user = req.session.user;

      if (!user) {
        return res.status(401).json({ error: "Not authorized", message: "Unauthenticated user" });
      }

      if (user.role !== role && user.role !== "admin") {
        return res.status(403).json({
          error: "Not authorized",
          message: "You do not have permissions to perform this action",
        });
      }

      return next();
    } catch (error) {
      logger.error("Error in authorization middleware:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "Error in authorization middleware:",
      });
    }
  };
};
