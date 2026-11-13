import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(flagService: FlagService = new FlagService()) {
    this.flagService = flagService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error) {
      if (error.message === 'FLAG_NOT_FOUND') {
        return res.status(404).json({ status: 'fail', message: 'Data flag tidak ditemukan' });
      }
      if (error.message === 'INVALID_FLAG_STATUS') {
        return res.status(400).json({ status: 'fail', message: 'Status flag tidak valid' });
      }
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getFlags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.flagService.getAllFlags();
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateFlagStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.flagService.updateFlagStatus(Number(req.params.id), req.body.status);
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}