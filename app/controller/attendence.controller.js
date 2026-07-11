const { default: mongoose } = require("mongoose");
const attendanceModel = require("../model/attendenceModel");
const batchModel = require("../model/batchModel");
const courseModel = require("../model/courseModel");
const enrollmentModel = require("../model/enrollmentModel");
const userModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

class AttentendenceController {
  async markAttendance(req, res) {
    try {
      const { batchId, date, attendance } = req.body;

      const batch = await batchModel.findById(batchId);

      if (batch.teacherId.toString() !== req.user.id) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const alreadyMarked = await attendanceModel.findOne({
        batchId,
        date,
      });

      if (alreadyMarked) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Attendance already marked",
        });
      }

      const batchStudents = batch.students.map((id) => id.toString());

      for (const item of attendance) {
        if (!batchStudents.includes(item.studentId)) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Student does not belong to this batch",
          });
        }
      }

      const data = new attendanceModel({
        batchId,
        date,
        attendance,
        markedBy: req.user.id,
      });
      const result = await data.save();
      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Attendance marked",
        data: result,
      });
    } catch (error) {
      logger.error("Error while giving attendance to student: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMyAttendance(req, res) {
    try {
      const result = await attendanceModel.aggregate([
        {
          $unwind: "$attendance",
        },
        {
          $match: {
            "attendance.studentId": new mongoose.Types.ObjectId(req.user.id),
          },
        },
        {
          $lookup: {
            from: "batches",
            localField: "batchId",
            foreignField: "_id",
            as: "batch",
          },
        },
        {
          $unwind: "$batch",
        },
        {
          $project: {
            _id: 0,
            date: 1,
            batchName: "$batch.batchName",
            courseId: "$batch.courseId",
            status: "$attendance.status",
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        totalClasses: result.length,
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching attendance: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getBatchAttendance(req, res) {
    try {
      const { batchId } = req.params;

      const result = await attendanceModel.aggregate([
        {
          $match: {
            batchId: new mongoose.Types.ObjectId(batchId),
          },
        },
        {
          $unwind: "$attendance",
        },
        {
          $group: {
            _id: "$attendance.studentId",
            totalClasses: { $sum: 1 },
            presentDays: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "present"] }, 1, 0],
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            _id: 0,
            studentName: "$student.name",
            totalClasses: 1,
            presentDays: 1,
            attendancePercentage: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ["$presentDays", "$totalClasses"],
                    },
                    100,
                  ],
                },
                2,
              ],
            },
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AttentendenceController();
