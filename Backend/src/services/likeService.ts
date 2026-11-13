import { LikeRepository, type LikeInput } from '../repositories/likeRepository.ts';
import type { LikeResponseDto } from '../dtos/likeDto.ts';

export class LikeService {
  private likeRepository: LikeRepository;

  constructor(likeRepository: LikeRepository = new LikeRepository()) {
    this.likeRepository = likeRepository;
  }

  private toDto(row: any): LikeResponseDto {
    return {
      id: row.id,
      reviewId: row.reviewId,
      userId: row.userId,
      createdAt: row.createdAt,
    };
  }

  async addLike(input: LikeInput): Promise<LikeResponseDto> {
    const row = await this.likeRepository.create(input);
    if (!row) throw new Error('LIKE_CREATION_FAILED');
    return this.toDto(row);
  }

  async removeLike(input: LikeInput): Promise<LikeResponseDto> {
    const row = await this.likeRepository.remove(input);
    if (!row) throw new Error('LIKE_NOT_FOUND');
    return this.toDto(row);
  }
}