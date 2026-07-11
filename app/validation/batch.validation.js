const Joi = require("joi");

const batchValidation = Joi.object({
  batchName: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Batch name is required",
    "string.min": "Batch name must be at least 3 characters",
    "string.max": "Batch name cannot exceed 100 characters",
    "any.required": "Batch name is required",
  }),

  courseId: Joi.string().required().messages({
    "string.empty": "Course is required",
    "any.required": "Course is required",
  }),

  teacherId: Joi.string().required().messages({
    "string.empty": "Teacher is required",
    "any.required": "Teacher is required",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "Start date is invalid",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.greater": "End date must be after start date",
    "any.required": "End date is required",
  }),
});

module.exports = batchValidation;
