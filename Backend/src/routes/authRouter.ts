import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { ProfileController } from '../controllers/profileController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const authController = new AuthController();
const profileController = new ProfileController();

authRouter.post('/register', validate(registerSchema, 'body'), (req, res) => {
  return authController.register(req, res);
});

authRouter.post('/login', validate(loginSchema, 'body'), (req, res) => {
  return authController.login(req, res);
});

authRouter.get('/me', authenticate, (req, res) => {
  return authController.getMe(req, res);
});

authRouter.get('/profile', authenticate, (req, res) => {
  return profileController.getProfile(req, res);
});

export { authRouter };
