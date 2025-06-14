const joi = require("joi");

const validationSchemas = {
  register: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be exactly 10 digits.",
        "any.required": "Phone number is required.",
      }),
    password: joi.string().min(6).required(),
  }),
  login: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
  sendMessage: joi.object({
    message: joi.string().trim().required(),
  }),
};

module.exports = validationSchemas;
