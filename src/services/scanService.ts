/**
 * 扫描服务
 * 封装扫描相关的 API 调用
 */

import { get, post } from '~/utils/request';

import type { IPageParams, IPageResponse } from './types';
import type { IScanRecord } from '~/store/business/scan/scanStore';

/** 上传扫描结果参数 */
export interface IUploadScanParams {
  code: string;
  type: 'qrcode' | 'barcode';
  result?: string;
}

/** 上传扫描结果响应 */
export interface IUploadScanResponse {
  id: string;
  success: boolean;
}

/** 扫描服务 */
export const scanService = {
  /** 上传扫描结果 */
  uploadScanResult: (params: IUploadScanParams) =>
    post<IUploadScanParams, IUploadScanResponse>({ url: '/scan/upload', data: params }),

  /** 获取扫描历史 */
  getScanHistory: (params: IPageParams) =>
    get<IPageParams, IPageResponse<IScanRecord>>({ url: '/scan/history', data: params }),
};
