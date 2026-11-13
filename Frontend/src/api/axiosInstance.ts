import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export interface ParsedApiError {
  statusCode?: number;
  message: string;
  details?: string[];
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiErrorResponse>;

    if (!axiosErr.response) {
      return {
        message: 'Gagal terhubung ke server. Pastikan backend berjalan di ' + BASE_URL,
      };
    }

    const { status, data } = axiosErr.response;
    let details: string[] | undefined;

    if (Array.isArray(data?.errors)) {
      details = data.errors.map((err: { path?: string[]; message?: string }) =>
        err.path?.length ? `${err.path.join('.')}: ${err.message}` : String(err.message || err),
      );
    }

    let defaultMessage = 'Terjadi kesalahan pada permintaan.';
    if (status === 401) {
      defaultMessage = '401 Unauthorized: Sesi habis atau Anda belum login.';
    } else if (status === 403) {
      defaultMessage = '403 Forbidden: Anda tidak memiliki hak akses untuk aksi ini.';
    } else if (status === 404) {
      defaultMessage = '404 Not Found: Data yang dicari tidak ditemukan.';
    }

    return {
      statusCode: status,
      message: data?.message ? `[${status}] ${data.message}` : defaultMessage,
      details,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga.',
  };
}
