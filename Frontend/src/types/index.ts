export type UserRole = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: User;
}

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface StallListResponse {
  status: string;
  meta: PaginationMeta;
  data: Stall[];
}

export interface SingleResponse<T> {
  status: string;
  data: T;
}

export interface StallQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface StallPayload {
  name: string;
  category?: string | null;
  location?: string | null;
  description?: string | null;
}

export interface ApiErrorResponse {
  status?: string;
  message?: string;
  errors?: unknown;
}
