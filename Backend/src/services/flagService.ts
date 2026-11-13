import { FlagRepository } from '../repositories/flagRepository.ts';
import type { FlagResponseDto } from '../dtos/flagDto.ts';

type FlagRow = NonNullable<Awaited<ReturnType<FlagRepository['findById']>>>;

export class FlagService {
  private flagRepository: FlagRepository;

  constructor(flagRepository: FlagRepository = new FlagRepository()) {
    this.flagRepository = flagRepository;
  }

  private toDto(row: FlagRow): FlagResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      reportedBy: row.reportedBy,
      reason: row.reason,
      status: row.status,
      createdAt: row.createdAt!,
    };
  }

  async getAllFlags(): Promise<FlagResponseDto[]> {
    const rows = await this.flagRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async updateFlagStatus(id: number, status: 'pending' | 'resolved' | 'dismissed'): Promise<FlagResponseDto> {
    const validStatuses = ['pending', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      throw new Error('INVALID_FLAG_STATUS');
    }

    const row = await this.flagRepository.updateStatus(id, status);
    if (!row) throw new Error('FLAG_NOT_FOUND');
    return this.toDto(row);
  }
}