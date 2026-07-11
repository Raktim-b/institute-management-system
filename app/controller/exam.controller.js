const { default: mongoose } = require("mongoose");
const batchModel = require("../model/batchModel");
const examModel = require("../model/examModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");

class ExamController {
  async createExam(req, res) {
    try {
      const { batchId, examName, examDate, duration, totalMarks } = req.body;

      const batch = await batchModel.findById(batchId);

      if (!batch) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Batch not found",
        });
      }

      // Teacher can create exam only for own batch
      if (
        req.user.role === "teacher" &&
        batch.teacherId.toString() !== req.user.id
      ) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const alreadyExists = await examModel.findOne({
        batchId,
        examName,
      });

      if (alreadyExists) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Exam already exists",
        });
      }

      const exam = new examModel({
        batchId,
        examName,
        examDate,
        duration,
        totalMarks,
        createdBy: req.user.id,
      });

      const result = await exam.save();

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Exam created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while creating exam: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async assignMarks(req, res) {
    try {
      const { examId, marks } = req.body;

      const exam = await examModel.findById(examId);

      if (!exam) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Exam not found",
        });
      }

      const batch = await batchModel.findById(exam.batchId);

      if (
        req.user.role === "teacher" &&
        batch.teacherId.toString() !== req.user.id
      ) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const batchStudents = batch.students.map((id) => id.toString());

      for (const item of marks) {
        if (!batchStudents.includes(item.studentId)) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Student does not belong to this batch",
          });
        }

        if (item.obtainedMarks > exam.totalMarks || item.obtainedMarks < 0) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid marks",
          });
        }

        const alreadyAssigned = exam.marks.find(
          (mark) => mark.studentId.toString() === item.studentId,
        );

        if (alreadyAssigned) {
          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Marks already assigned",
          });
        }
      }

      exam.marks.push(...marks);

      await exam.save();

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Marks assigned successfully",
        data: exam,
      });
    } catch (error) {
      logger.error("Error while assigning marks: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getStudentResults(req, res) {
    try {
      const { studentId } = req.params;

      const result = await examModel.aggregate([
        {
          $unwind: "$marks",
        },
        {
          $match: {
            "marks.studentId": new mongoose.Types.ObjectId(studentId),
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
          $lookup: {
            from: "users",
            localField: "marks.studentId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 0,
            studentName: "$user.name",
            examName: 1,
            examDate: 1,
            totalMarks: 1,
            batchName: "$batch.batchName",
            obtainedMarks: "$marks.obtainedMarks",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching student results: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getMyResults(req, res) {
    try {
     

      const result = await examModel.aggregate([
        {
          $unwind: "$marks",
        },
        {
          $match: {
            "marks.studentId": new mongoose.Types.ObjectId(req.user.id),
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
          $lookup: {
            from: "users",
            localField: "marks.studentId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 0,
            studentName: "$user.name",
            examName: 1,
            examDate: 1,
            totalMarks: 1,
            batchName: "$batch.batchName",
            obtainedMarks: "$marks.obtainedMarks",
          },
        },
      ]);

      return res.status(httpStatusCode.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error("Error while fetching student results: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateExam(req, res) {
  try {
    const { id } = req.params;

    const exam = await examModel.findById(id);

    if (!exam) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Get the batch of this exam
    const batch = await batchModel.findById(exam.batchId);

    if (!batch) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        success: false,
        message: "Batch not found",
      });
    }

    // Teacher can update only own batch exams
    if (
      req.user.role === "teacher" &&
      batch.teacherId.toString() !== req.user.id
    ) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await examModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Exam updated successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error while updating exam: %s", error.stack);

    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}
}

module.exports = new ExamController();
