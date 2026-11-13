import { and, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface LikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async create(input: LikeInput) {
    const db = await getDb();
    const rows = await db.insert(likes).output().values(input);
    return rows[0];
  }

  async remove(input: LikeInput) {
    const db = await getDb();
    const rows = await db
      .delete(likes)
      .where(and(eq(likes.reviewId, input.reviewId), eq(likes.userId, input.userId)))
      .output();
    return rows[0];
  }
}