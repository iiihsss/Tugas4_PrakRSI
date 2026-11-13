import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), (req, res) => {
  return stallController.getStalls(req, res);
});

stallRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  return stallController.getStallById(req, res);
});

stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), (req, res) => {
  return stallController.getStallMenus(req, res);
});

stallRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createStallSchema, 'body'),
  (req, res) => {
    return stallController.createStall(req, res);
  },
);

stallRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(idParamSchema, 'params'),
  validate(updateStallSchema, 'body'),
  (req, res) => {
    return stallController.updateStall(req, res);
  },
);

stallRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  (req, res) => {
    return stallController.deleteStall(req, res);
  },
);

stallRouter.post(
  '/:id/reviews',
  authenticate,
  validate(idParamSchema, 'params'),
  validate(createReviewSchema, 'body'),
  (req, res) => {
    return reviewController.createForStall(req, res);
  },
);

export { stallRouter };
