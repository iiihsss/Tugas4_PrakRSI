import type { Request, Response } from 'express';
import { ReportService } from '../services/reportService.ts';
import { getUser } from '../middlewares/auth.ts';

export class AdminController {
  private reportService: ReportService;

  constructor(reportService: ReportService = new ReportService()) {
    this.reportService = reportService;
  }

  getReports = async (req: Request, res: Response): Promise<void> => {
    const { email } = getUser(req);
    const data = await this.reportService.getSummary();

    res.status(200).json({ status: 'success', meta: { requestedBy: email }, data });
  };
}
