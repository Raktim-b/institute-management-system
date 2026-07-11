const { default: mongoose } = require("mongoose");
const enrollmentModel = require("../model/enrollmentModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");
const examModel = require("../model/examModel");
const attendanceModel = require("../model/attendenceModel");
const userModel = require("../model/userModel");
const sendStudentReport = require("../utils/sendStudentReport");

class ReportController {
  async getCoursesWithEnrollments(req, res) {
    try {
      const result = await enrollmentModel.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $group: {
            _id: "$course.courseName",
            totalEnrollments: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            courseName: "$_id",
            totalEnrollments: 1,
          },
        },
        {
          $sort: {
            courseName: 1,
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error(
        "Error while fetching courses with enrollments: %s",
        error.stack,
      );

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getBatchReport(req, res) {
    try {
      const { batchId } = req.params;

      // Attendance Report
      const attendanceReport = await attendanceModel.aggregate([
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

      // Exam Performance
      const examPerformance = await examModel.aggregate([
        {
          $match: {
            batchId: new mongoose.Types.ObjectId(batchId),
          },
        },
        {
          $unwind: "$marks",
        },
        {
          $group: {
            _id: null,
            totalStudents: {
              $sum: 1,
            },
            averageMarks: {
              $avg: "$marks.obtainedMarks",
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalStudents: 1,
            averageMarks: {
              $round: ["$averageMarks", 2],
            },
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        attendanceReport,
        examPerformance,
      });
    } catch (error) {
      logger.error("Error while fetching batch report: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMyPerformance(req, res) {
    try {
      const studentId = req.user.id;

      const attendance = await attendanceModel.aggregate([
        {
          $unwind: "$attendance",
        },
        {
          $match: {
            "attendance.studentId": new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $group: {
            _id: null,
            totalClasses: { $sum: 1 },
            presentDays: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "present"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
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

      const exam = await examModel.aggregate([
        {
          $unwind: "$marks",
        },
        {
          $match: {
            "marks.studentId": new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $group: {
            _id: null,
            averageMarks: {
              $avg: "$marks.obtainedMarks",
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageMarks: {
              $round: ["$averageMarks", 2],
            },
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        attendance: attendance[0] || { attendancePercentage: 0 },
        exam: exam[0] || { averageMarks: 0 },
      });
    } catch (error) {
      logger.error("Error fetching performance: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getStudentPerformance(req, res) {
    try {
      const { studentId } = req.params;
      const student = await userModel.findById(studentId);

      if (!student) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Student not found",
        });
      }
      const attendance = await attendanceModel.aggregate([
        {
          $unwind: "$attendance",
        },
        {
          $match: {
            "attendance.studentId": new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $group: {
            _id: null,
            totalClasses: { $sum: 1 },
            presentDays: {
              $sum: {
                $cond: [{ $eq: ["$attendance.status", "present"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
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

      const averageExam = await examModel.aggregate([
        {
          $unwind: "$marks",
        },
        {
          $match: {
            "marks.studentId": new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $group: {
            _id: null,
            averageMarks: {
              $avg: "$marks.obtainedMarks",
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageMarks: {
              $round: ["$averageMarks", 2],
            },
          },
        },
      ]);
      const examResults = await examModel.aggregate([
        {
          $unwind: "$marks",
        },
        {
          $match: {
            "marks.studentId": new mongoose.Types.ObjectId(studentId),
          },
        },
        {
          $project: {
            _id: 0,
            examName: 1,
            totalMarks: 1,
            obtainedMarks: "$marks.obtainedMarks",
          },
        },
      ]);
      await sendStudentReport(
        student,
        attendance[0]?.attendancePercentage || 0,
        averageExam[0]?.averageMarks || 0,
        examResults,
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        attendance: attendance[0] || { attendancePercentage: 0 },
        exam: averageExam[0] || { averageMarks: 0 },
        examResults,
      });
    } catch (error) {
      logger.error("Error fetching performance: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ReportController();
