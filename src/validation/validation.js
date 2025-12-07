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

export const requestResetEmailShema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  })
};



export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required()
  }),
};
