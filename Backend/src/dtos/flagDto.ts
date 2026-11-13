export interface UpdateFlagStatusInput {
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface FlagResponseDto {
  id: number;
  reviewId: number;
  reportedBy: number;
  reason: string | null;
  status: string;
  createdAt: Date;
}