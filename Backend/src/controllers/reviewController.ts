import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { CreateReviewInput } from '../schemas/reviewSchema.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'INVALID_RATING_VALUE') {
      return res.status(400).json({ status: 'fail', message: 'Nilai rating tidak valid' });
    }
    return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
  }

  getReviews = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.reviewService.getAllReviews();
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<void> => {
    const data = await this.reviewService.deleteReview(Number(req.params.id));
    res.status(200).json({ status: 'success', data });
  };

  createForStall = async (req: Request, res: Response): Promise<void> => {
    const { id: stallId } = getValidated<IdParam>(res, 'params');
    const body = getValidated<CreateReviewInput>(res, 'body');

    const { id: userId } = getUser(req);

    const data = await this.reviewService.createForStall(stallId, userId, body);
    res.status(201).json({ status: 'success', data });
  };
}
