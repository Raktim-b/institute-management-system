const Joi = require("joi");

const courseValidation = Joi.object({
  courseName: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Course name is required",
    "string.min": "Course name must be at least 3 characters",
    "string.max": "Course name cannot exceed 100 characters",
    "any.required": "Course name is required",
  }),

  description: Joi.string().trim().min(10).max(500).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),

  duration: Joi.string().trim().required().messages({
    "string.empty": "Duration is required",
    "any.required": "Duration is required",
  }),

  fees: Joi.number().min(0).required().messages({
    "number.base": "Fees must be a number",
    "number.min": "Fees cannot be negative",
    "any.required": "Fees is required",
  }),
});

module.exports = courseValidation;
