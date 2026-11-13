import { and, avg, count, eq, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users, stalls } from '../db/schema.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findAll() {
    const db = await getDb();
    return await db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
        stallName: stalls.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(stalls, eq(reviews.stallId, stalls.id))
      .orderBy(reviews.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(reviews).where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment ?? null,
        likeCount: 0,
      });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }

  async findByStallAndUser(stallId: number, userId: number) {
    const db = await getDb();
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.stallId, stallId), eq(reviews.userId, userId)));
    return rows[0];
  }

  async refreshStallSummary(stallId: number) {
    const db = await getDb();

    const stats = await db
      .select({
        total: count(),
        average: avg(sql<number>`cast(${reviews.rating} as decimal(10, 4))`),
      })
      .from(reviews)
      .where(eq(reviews.stallId, stallId));

    const total = Number(stats[0]?.total ?? 0);
    const average = Number(stats[0]?.average ?? 0);

    const updated = await db
      .update(stalls)
      .set({ reviewCount: total, avgRating: average.toFixed(2) })
      .where(eq(stalls.id, stallId))
      .output();

    return updated[0];
  }
}