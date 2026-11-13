import { axiosInstance } from './axiosInstance';
import type {
  SingleResponse,
  Stall,
  StallListResponse,
  StallPayload,
  StallQueryParams,
} from '../types';

export const stallApi = {
  getAll: async (params: StallQueryParams): Promise<StallListResponse> => {
    const cleanParams: Record<string, string | number> = {};
    if (params.search && params.search.trim() !== '') {
      cleanParams.search = params.search.trim();
    }
    if (params.category && params.category.trim() !== '') {
      cleanParams.category = params.category.trim();
    }
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    const response = await axiosInstance.get<StallListResponse>('/stalls', {
      params: cleanParams,
    });
    return response.data;
  },

  getById: async (id: number | string): Promise<Stall> => {
    const response = await axiosInstance.get<SingleResponse<Stall>>(`/stalls/${id}`);
    return response.data.data;
  },

  create: async (payload: StallPayload): Promise<Stall> => {
    const response = await axiosInstance.post<SingleResponse<Stall>>('/stalls', payload);
    return response.data.data;
  },

  update: async (id: number | string, payload: Partial<StallPayload>): Promise<Stall> => {
    const response = await axiosInstance.put<SingleResponse<Stall>>(`/stalls/${id}`, payload);
    return response.data.data;
  },

  remove: async (id: number | string): Promise<Stall> => {
    const response = await axiosInstance.delete<SingleResponse<Stall>>(`/stalls/${id}`);
    return response.data.data;
  },
};
