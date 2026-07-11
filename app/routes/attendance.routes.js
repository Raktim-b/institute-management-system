const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const AttendenceController = require("../controller/attendence.controller");
// const courseRateLimiter = require("../middleware/rateLimiter");
const attendanceRouter = express.Router();

attendanceRouter.post(
  "/mark",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher"),
  AttendenceController.markAttendance,
);
attendanceRouter.get(
  "/get",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("student"),
  AttendenceController.getMyAttendance,
);
attendanceRouter.get(
  "/get/:batchId",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher"),
  AttendenceController.getBatchAttendance,
);
module.exports = attendanceRouter;
