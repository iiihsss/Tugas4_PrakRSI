import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export class MenuItemRepository {
  async findAll() {
    const db = await getDb();
    return await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stallName: stalls.name,
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .orderBy(menuItems.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return rows[0];
  }

  async findByStallId(stallId: number) {
    const db = await getDb();
    return await db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db.insert(menuItems).output().values(input);
    return rows[0];
  }

  async update(id: number, input: Partial<CreateMenuItemInput>) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set(input)
      .where(eq(menuItems.id, id))
      .output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }
}