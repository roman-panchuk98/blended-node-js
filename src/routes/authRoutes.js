import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailShema,
  resetPasswordSchema,
} from '../validation/validation.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  requestResetEmail,
  resetPassword,
  updateUserAvatar,
} from '../controllers/authController.js';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/authenticate.js';
const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshUserSession);
router.post(
  '/auth/request-reset-email',
  celebrate(requestResetEmailShema),
  requestResetEmail,
);

router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
