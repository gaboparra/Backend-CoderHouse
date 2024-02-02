export const authorization = (role) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "Not authorized", message: "Unauthenticated user" });
      }

      if (user.role !== role) {
        return res.status(403).json({
            error: "Not authorized",
            message: "You do not have permissions to perform this action",
          });
      }

      return next();
    } catch (error) {
      console.error("Error in authorization middleware:", error);
      return res.status(500).json({
          error: "Internal Server Error",
          message: "Error in authorization middleware:",
        });
    }
  };
};
