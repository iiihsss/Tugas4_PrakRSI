export interface LikeInput {
  reviewId: number;
  userId: number;
}

export interface LikeResponseDto {
  id: number;
  reviewId: number;
  userId: number;
  createdAt: Date;
}