import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export interface CreateAuditInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export class AuditRepository {
  async findAll() {
    const db = await getDb();
    return await db.select().from(auditLogs).orderBy(auditLogs.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(auditLogs).where(eq(auditLogs.id, id));
    return rows[0];
  }

  async create(input: CreateAuditInput) {
    const db = await getDb();
    const rows = await db
      .insert(auditLogs)
      .output()
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata ?? null,
      });
    return rows[0];
  }
}