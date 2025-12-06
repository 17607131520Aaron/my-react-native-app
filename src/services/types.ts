/**
 * API 服务层类型定义
 */

/** API 响应结构 */
export interface IApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/** 分页参数 */
export interface IPageParams {
  page: number;
  pageSize: number;
}

/** 分页响应 */
export interface IPageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
