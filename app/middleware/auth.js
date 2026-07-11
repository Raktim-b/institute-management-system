const jwt = require("jsonwebtoken");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

const AuthCheck = (req, res, next) => {
  const token =
    req?.body?.token ||
    req?.query?.token ||
    req?.headers["x-access-token"] ||
    req?.headers["authorization"];
  logger.info("Received Token:", token);
  if (!token) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      success: false,
      message: "Token is required for access this url",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info("Decoded:", decoded);
    req.user = decoded;
  } catch (error) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
  return next();
};
module.exports = AuthCheck;
