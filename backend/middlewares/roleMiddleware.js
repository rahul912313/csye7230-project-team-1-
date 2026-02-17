/**
 * Role-based Authorization Middleware for QuickRent
 * Checks if user has required role to access resource
 */

/**
 * Middleware factory to check user role
 * @param {String|Array} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} Express middleware function
 */
const roleMiddleware = (allowedRoles) => {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // Check if user role exists (should be set by authMiddleware)
    if (!req.userRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: No role found for the user",
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Required role(s): ${roles.join(", ")}`,
        userRole: req.userRole,
      });
    }

    // Role is verified, proceed to next middleware
    next();
  };
};

module.exports = roleMiddleware;
