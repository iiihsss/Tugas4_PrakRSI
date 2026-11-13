import { axiosInstance } from './axiosInstance';
import type { LoginResponse, SingleResponse, User, UserRole } from '../types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<User> => {
    const response = await axiosInstance.post<SingleResponse<{ user: User }>>(
      '/auth/register',
      payload,
    );
    return response.data.data.user;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<SingleResponse<LoginResponse>>(
      '/auth/login',
      payload,
    );
    return response.data.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<SingleResponse<User>>('/auth/me');
    return response.data.data;
  },
};
