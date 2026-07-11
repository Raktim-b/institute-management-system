const courseModel = require("../model/courseModel");
const httpStatusCode = require("../utils/httpStatusCode");
const logger = require("../utils/logger");
const courseValidation = require("../validation/courseValidation");
const cloudinary = require("../config/cloudinary");
const userModel = require("../model/userModel");
const enrollmentModel = require("../model/enrollmentModel");

class CourseController {
  async createCourse(req, res) {
    try {
      const { error } = courseValidation.validate(req.body);

      if (error) {
        logger.warn("Validation failed: %s", error.details[0].message);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const { courseName, description, duration, fees } = req.body;

      logger.debug("Course added request received for email: %s", courseName);

      const existCourse = await courseModel.findOne({ courseName });

      if (existCourse) {
        logger.warn(
          "Course addition failed: Course already exists (%s)",
          courseName,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Course already exists",
        });
      }
      const courseData = new courseModel({
        courseName,
        description,
        duration,
        fees,
      });
      if (req.file) {
        courseData.image = req.file.path;
        courseData.public_id = req.file.filename;
      }
      const result = await courseData.save();

      logger.info("Course added successfully: %s", courseName);

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Course Added successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while adding course: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCourse(req, res) {
    try {
      const userData = await courseModel.find({ isDeleted: false });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Coursed fetched successfully",
        data: userData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const userData = await courseModel.findById(id);
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Coursed fetched successfully",
        data: userData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateCourse(req, res) {
    try {
      const { id } = req.params;

      const course = await courseModel.findById(id);

      if (!course) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const updateObj = { ...req.body };

      if (req.file) {
        if (course.public_id) {
          await cloudinary.uploader.destroy(course.public_id);
        }

        updateObj.image = req.file.path;
        updateObj.public_id = req.file.filename;
      }

      const result = await courseModel.findByIdAndUpdate(id, updateObj, {
        new: true,
        runValidators: true,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Course updated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async deleteCourse(req, res) {
    try {
      const { id } = req.params;

      const course = await courseModel.findById(id);

      if (!course) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }
      if (course.isDeleted) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Course is already deleted",
        });
      }
      const result = await courseModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
          new: true,
        },
      );

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Course deleted successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async enrollStudent(req, res) {
    try {
      const { studentId, courseId } = req.body;

      const student = await userModel.findById(studentId);

      if (!student) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Student not found",
        });
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Course not found",
        });
      }

      const alreadyEnrolled = await enrollmentModel.findOne({
        studentId,
        courseId,
      });

      if (alreadyEnrolled) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Student already enrolled in this course",
        });
      }

      const enrollment = new enrollmentModel({
        studentId,
        courseId,
      });
      const result = await enrollment.save();
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Student enrolled successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while enrolling student: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CourseController();
