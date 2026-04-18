const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({
        message: "Forbidden: No role found for the user",
      });
    }

    if (req.userRole !== role) {
      return res.status(403).json({
        message: `Forbidden: You do not have the required role - ${role}`,
      });
    }

    next(); // Role is verified, allow the request to pass
  };
};

module.exports = roleMiddleware;
