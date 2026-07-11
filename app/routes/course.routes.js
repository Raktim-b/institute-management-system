const express = require("express");
const AuthCheck = require("../middleware/auth");
const ProductImage = require("../middleware/fileUploades");
const allowRoles = require("../middleware/allowRoles");
const courseController = require("../controller/course.controller");
const courseRateLimiter = require("../middleware/rateLimiter");
const courseRouter = express.Router();

courseRouter.post(
  "/create",
  AuthCheck,
  courseRateLimiter,
  ProductImage.single("image"),
  allowRoles("admin"),
  courseController.createCourse,
);
courseRouter.get("/get", AuthCheck, courseController.getCourse);
courseRouter.get("/get/:id", AuthCheck, courseController.getCourseById);

courseRouter.put(
  "/update/:id",
  AuthCheck,
  courseRateLimiter,
  ProductImage.single("image"),
  courseController.updateCourse,
);

courseRouter.delete(
  "/delete/:id",
  courseRateLimiter,
  AuthCheck,
  ProductImage.single("image"),
  courseController.deleteCourse,
);
courseRouter.post(
  "/enroll",
  // courseRateLimiter,
  AuthCheck,
  allowRoles("admin"),
  courseController.enrollStudent,
);

module.exports = courseRouter;
