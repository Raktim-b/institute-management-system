const express = require("express");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");
const courseRouter = require("./course.routes");
const batchRouter = require("./batch.routes");
const attendanceRouter = require("./attendance.routes");
const examRouter = require("./exam.routes");
const reportRouter = require("./report.routes");

const router = express.Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
router.use("/batch", batchRouter);
router.use("/attendence", attendanceRouter);
router.use("/exam", examRouter);
router.use("/report", reportRouter);


module.exports = router;
