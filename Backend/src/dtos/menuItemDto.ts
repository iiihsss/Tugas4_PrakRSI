export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuItemDto {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
  stallName?: string;
}