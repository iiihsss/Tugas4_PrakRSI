import { Router } from 'express';
import { AdminController } from '../controllers/adminController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';

const adminRouter = Router();
const adminController = new AdminController();

adminRouter.get('/reports', authenticate, authorize('admin'), (req, res) => {
  return adminController.getReports(req, res);
});

export { adminRouter };
