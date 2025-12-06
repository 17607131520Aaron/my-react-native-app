/**
 * API 服务层统一导出
 */

// 类型
export type { IApiResponse, IPageParams, IPageResponse } from './types';

// 用户服务
export {
  userService,
  type ILoginParams,
  type ILoginResponse,
  type IUpdateProfileParams,
} from './userService';

// 扫描服务
export { scanService, type IUploadScanParams, type IUploadScanResponse } from './scanService';
