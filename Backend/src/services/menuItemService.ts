import { MenuItemRepository, type CreateMenuItemInput } from '../repositories/menuItemRepository.ts';
import type { MenuItemDto } from '../dtos/menuItemDto.ts';

type MenuItemRow = NonNullable<Awaited<ReturnType<MenuItemRepository['findById']>>>;

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(menuItemRepository: MenuItemRepository = new MenuItemRepository()) {
    this.menuItemRepository = menuItemRepository;
  }

  private toDto(row: any): MenuItemDto {
    return {
      id: row.id,
      stallId: row.stallId,
      name: row.name,
      price: row.price,
      isAvailable: row.isAvailable,
      stallName: row.stallName,
    };
  }

  async getAllMenuItems(): Promise<MenuItemDto[]> {
    const rows = await this.menuItemRepository.findAll();
    return rows.map((row) => this.toDto(row));
  }

  async getMenuItemById(id: number): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.findById(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.create(input);
    if (!row) throw new Error('MENU_ITEM_CREATION_FAILED');
    return this.toDto(row);
  }

  async updateMenuItem(id: number, input: Partial<CreateMenuItemInput>): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.update(id, input);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }

  async deleteMenuItem(id: number): Promise<MenuItemDto> {
    const row = await this.menuItemRepository.remove(id);
    if (!row) throw new Error('MENU_ITEM_NOT_FOUND');
    return this.toDto(row);
  }
}