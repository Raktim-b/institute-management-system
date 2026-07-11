const express = require("express");
const AuthCheck = require("../middleware/auth");
const courseRateLimiter = require("../middleware/rateLimiter");
const reportController = require("../controller/report.controller");
const allowRoles = require("../middleware/allowRoles");
const reportRouter = express.Router();

reportRouter.get(
  "/list",
  AuthCheck,
  allowRoles("admin"),
  reportController.getCoursesWithEnrollments,
);
reportRouter.get(
  "/batch/:batchId",
  AuthCheck,
  allowRoles("admin", "teacher"),
  reportController.getBatchReport,
);
reportRouter.get(
  "/student",
  AuthCheck,
  allowRoles("student"),
  reportController.getMyPerformance,
);
reportRouter.get(
  "/student/:studentId",
  AuthCheck,
  allowRoles("admin", "teacher"),
  reportController.getStudentPerformance,
);
module.exports = reportRouter;
