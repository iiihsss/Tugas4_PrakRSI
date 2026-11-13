import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'LIKE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data like tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  addLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.addLike(req.body);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  removeLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.likeService.removeLike(req.body);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}