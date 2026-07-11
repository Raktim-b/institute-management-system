const express = require("express");
const AuthCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
// const courseRateLimiter = require("../middleware/rateLimiter");
const batchController = require("../controller/batch.controller");
const batchRouter = express.Router();

batchRouter.post(
  "/create",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("admin", "teacher"),
  batchController.createBatch,
);

batchRouter.put(
  "/assign/:batchId",
  AuthCheck,
  allowRoles("admin"),
  //   courseRateLimiter,
  batchController.assignStudents,
);
batchRouter.get(
  "/get",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("admin"),
  batchController.getAllBatchDetails,
);
batchRouter.get(
  "/get/:courseId",
  AuthCheck,
  //   courseRateLimiter,
  allowRoles("admin", "teacher"),
  batchController.getBatchByCourse,
);
batchRouter.get(
  "/my-batch",
  AuthCheck,
  //   courseRateLimiter,
  batchController.getMyBatches,
);
batchRouter.put(
  "/update/:id",
  AuthCheck,
  allowRoles("admin", "teacher"),
  //   courseRateLimiter,
  batchController.updateBatch,
);
batchRouter.delete(
  "/delete/:id",
  AuthCheck,
  allowRoles("admin"),
  batchController.deleteBatch,
);

module.exports = batchRouter;
