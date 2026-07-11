const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const examController = require("../controller/exam.controller");
// const courseRateLimiter = require("../middleware/rateLimiter");
const examRouter = express.Router();

examRouter.post(
  "/create",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher", "admin"),
  examController.createExam,
);
examRouter.post(
  "/marks",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher", "admin"),
  examController.assignMarks,
);
examRouter.get(
  "/get/:studentId",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher", "admin"),
  examController.getStudentResults,
);
examRouter.get(
  "/get",
  AuthCheck,
  //   courseRateLimiter,
  examController.getMyResults,
);
examRouter.put(
  "/update/:id",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("teacher", "admin"),
  examController.updateExam,
);

module.exports = examRouter;
