/**
 * API 服务
 * 统一管理 API 请求
 */

import { API_BASE_URL } from '../constants';
import type { ApiResponse } from '../types';

/**
 * 基础请求方法
 */
const request = async <T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
};

/**
 * GET 请求
 */
export const get = <T = unknown>(url: string): Promise<ApiResponse<T>> => {
  return request<T>(url, { method: 'GET' });
};

/**
 * POST 请求
 */
export const post = <T = unknown>(url: string, body?: unknown): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
