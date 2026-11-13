import { ReviewRepository, type CreateReviewInput as LegacyReviewInput } from '../repositories/reviewRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import type { ReviewResponseDto } from '../dtos/reviewDto.ts';
import { AppError } from '../errors/AppError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import type { CreateReviewInput } from '../schemas/reviewSchema.ts';

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private stallRepository: StallRepository;

  constructor(
    reviewRepository: ReviewRepository = new ReviewRepository(),
    stallRepository: StallRepository = new StallRepository(),
  ) {
    this.reviewRepository = reviewRepository;
    this.stallRepository = stallRepository;
  }

  private toDto(row: any): ReviewResponseDto {
    return {
      id: row.id,
      stallId: row.stallId,
      userId: row.userId,
      rating: row.rating,
      comment: row.comment,
      likeCount: row.likeCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? null,
      reviewerName: row.reviewerName,
      stallName: row.stallName,
    };
  }

  async getAllReviews(): Promise<ReviewResponseDto[]> {
    const rows = await this.reviewRepository.findAll();
    return rows.map((row: any) => this.toDto(row));
  }

  async createReview(input: LegacyReviewInput): Promise<ReviewResponseDto> {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('INVALID_RATING_VALUE');
    }
    const row = await this.reviewRepository.create(input);
    if (!row) throw new Error('REVIEW_CREATION_FAILED');
    return this.toDto(row);
  }

  async deleteReview(id: number): Promise<ReviewResponseDto> {
    const row = await this.reviewRepository.remove(id);
    if (!row) throw new NotFoundError('Data review tidak ditemukan');
    return this.toDto(row);
  }

  async createForStall(
    stallId: number,
    userId: number,
    input: CreateReviewInput,
  ): Promise<ReviewResponseDto> {
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new NotFoundError('Warung tidak ditemukan');

    const existing = await this.reviewRepository.findByStallAndUser(stallId, userId);
    if (existing) {
      throw new AppError(409, 'Kamu sudah pernah memberi review untuk warung ini');
    }

    const row = await this.reviewRepository.create({
      stallId,
      userId,
      rating: input.rating,
      comment: input.comment ?? null,
    });
    if (!row) throw new AppError(500, 'Review gagal disimpan');

    await this.reviewRepository.refreshStallSummary(stallId);

    return this.toDto(row);
  }
}
