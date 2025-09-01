import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, sendResetEmailSchema, resetPasswordSchema } from '../validation/authSchemas.js';
import { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPasswordController } from '../controllers/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), registerController);
router.post('/login', validateBody(loginSchema), loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);

export default router;
