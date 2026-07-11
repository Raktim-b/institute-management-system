const { default: mongoose } = require("mongoose");
const batchModel = require("../model/batchModel");
const courseModel = require("../model/courseModel");
const userModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");
const batchValidation = require("../validation/batch.validation");
const enrollmentModel = require("../model/enrollmentModel");

class BatchController {
  async createBatch(req, res) {
    try {
      const { error } = batchValidation.validate(req.body);
      if (error) {
        logger.warn("Validation failed: %s", error.details[0].message);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const { batchName, courseId, teacherId, startDate, endDate } = req.body;

      const course = await courseModel.findById(courseId);

      if (!course) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const teacher = await userModel.findById(teacherId);

      if (!teacher) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Teacher not found",
        });
      }

      const batch = new batchModel({
        batchName,
        courseId,
        teacherId,
        startDate,
        endDate,
      });
      const result = await batch.save();
      logger.info("Batch created successfully: %s", batchName);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Batch created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while creating batch: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async assignStudents(req, res) {
    try {
      const { batchId } = req.params;
      const { students } = req.body;

      const batch = await batchModel.findById(batchId);

      if (!batch) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Batch not found",
        });
      }

      const existingStudents = batch.students.map((id) => id.toString());

      for (const studentId of students) {
        const student = await userModel.findById(studentId);

        if (!student) {
          return res.status(httpStatusCode.NOT_FOUND).json({
            success: false,
            message: `Student not found: ${studentId}`,
          });
        }

        const enrollment = await enrollmentModel.findOne({
          studentId,
          courseId: batch.courseId,
        });

        if (!enrollment) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: `${student.name} is not enrolled in this course`,
          });
        }

        if (existingStudents.includes(studentId)) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: `${student.name} is already assigned to this batch`,
          });
        }

        enrollment.batchId = batch._id;
        await enrollment.save();
      }

      batch.students.push(...students);

      await batch.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Students assigned successfully",
        data: batch,
      });
    } catch (error) {
      logger.error("Error while assigning students: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getAllBatchDetails(req, res) {
    try {
      const result = await batchModel.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
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
          $lookup: {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $unwind: "$teacher",
        },
        {
          $lookup: {
            from: "users",
            localField: "students",
            foreignField: "_id",
            as: "students",
          },
        },
        {
          $project: {
            _id: 1,
            batchName: 1,
            startDate: 1,
            endDate: 1,
            status: 1,

            courseName: "$course.courseName",

            teacherName: "$teacher.name",

            totalStudents: {
              $size: "$students",
            },

            students: {
              $map: {
                input: "$students",
                as: "student",
                in: {
                  _id: "$$student._id",
                  name: "$$student.name",
                  email: "$$student.email",
                },
              },
            },
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch details fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching batch details: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getBatchByCourse(req, res) {
    try {
      const { courseId } = req.params;

      const result = await batchModel.aggregate([
        {
          $match: {
            courseId: new mongoose.Types.ObjectId(courseId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $unwind: "$teacher",
        },
        {
          $project: {
            _id: 1,
            batchName: 1,
            totalStudents: {
              $size: "$students",
            },
            teacherName: "$teacher.name",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch list fetched successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching batches: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMyBatches(req, res) {
    try {
      const studentId = req.user.id;

      const result = await batchModel.aggregate([
        {
          $match: {
            students: new mongoose.Types.ObjectId(studentId),
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $unwind: "$teacher",
        },
        {
          $project: {
            _id: 1,
            batchName: 1,
            teacherName: "$teacher.name",
            totalStudents: {
              $size: "$students",
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
  async updateBatch(req, res) {
    try {
      const { id } = req.params;

      const batch = await batchModel.findById(id);

      if (!batch) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Batch not found",
        });
      }

      const result = await batchModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteBatch(req, res) {
    try {
      const { id } = req.params;

      const batch = await batchModel.findById(id);

      if (!batch) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Batch not found",
        });
      }

      const result = await batchModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Batch deleted successfully",
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
module.exports = new BatchController();
