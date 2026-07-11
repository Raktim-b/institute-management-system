const express = require("express");
const AuthCheck = require("../middleware/auth");
const userController = require("../controller/user.controller");
const ProductImage = require("../middleware/fileUploades");
const allowRoles = require("../middleware/allowRoles");
const courseRateLimiter = require("../middleware/rateLimiter");
const userRouter = express.Router();

userRouter.get("/profile", AuthCheck, userController.getProfile);
userRouter.put(
  "/update",
  courseRateLimiter,
  AuthCheck,
  ProductImage.single("image"),
  userController.updateProfile,
);
userRouter.get("/get", AuthCheck, allowRoles("admin"), userController.getUser);

module.exports = userRouter;
