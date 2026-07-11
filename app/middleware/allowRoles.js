const httpStatusCode = require("../utils/httpStatusCode");

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(httpStatusCode.FORBIDDEN).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};
module.exports = allowRoles;
