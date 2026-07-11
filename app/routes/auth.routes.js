const express = require("express");
const authController = require("../controller/auth.controller");
const AuthCheck = require("../middleware/auth");
const courseRateLimiter = require("../middleware/rateLimiter");
const authRouter = express.Router();

authRouter.post("/create/role", authController.createRole);
authRouter.post("/create/admin", courseRateLimiter, authController.createAdmin);
authRouter.post(
  "/create/student",
  // courseRateLimiter,
  authController.registerStudent,
);
authRouter.post(
  "/create/teacher",
  courseRateLimiter,
  authController.registerTeacher,
);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.get("/verify/:token", authController.verify);

module.exports = authRouter;
