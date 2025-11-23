import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().required().trim(),
    password: Joi.string().required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().trim(),
    password: Joi.string().required(),
  }),
};
