const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 20 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),
});

module.exports = registerValidation;
