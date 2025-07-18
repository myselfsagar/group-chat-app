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
    receiverId: joi.number().optional(),
    groupId: joi.number().optional(),
  }),
  createGroup: joi.object({
    name: joi.string().trim().required(),
    about: joi.string().trim().optional(),
    noOfUsers: joi.string().trim().optional(),
  }),
};

module.exports = validationSchemas;
