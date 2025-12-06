/**
 * 扫描 Store
 * 存储扫描历史和设置
 */

import { createBusinessStore } from '../../core/createStore';

import type { IHydrationState } from '../../core/types';

/** 扫描记录接口 */
export interface IScanRecord {
  id: string;
  code: string;
  type: 'qrcode' | 'barcode';
  timestamp: Date;
  result?: string;
}

/** 扫描设置接口 */
export interface IScanSettings {
  /** 是否启用闪光灯 */
  flashEnabled: boolean;
  /** 是否启用声音 */
  soundEnabled: boolean;
  /** 是否启用震动 */
  vibrationEnabled: boolean;
}

/** 扫描状态接口 */
export interface IScanState extends Record<string, unknown> {
  /** 扫描历史 */
  history: IScanRecord[];
  /** 扫描设置 */
  settings: IScanSettings;
  /** 添加扫描记录 */
  addRecord: (record: IScanRecord) => void;
  /** 清空历史 */
  clearHistory: () => void;
  /** 更新设置 */
  updateSettings: (settings: Partial<IScanSettings>) => void;
}

/** 默认扫描设置 */
const defaultSettings: IScanSettings = {
  flashEnabled: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

/** 扫描 Store */
export const useScanStore = createBusinessStore<IScanState>('scan', 'scan', (set, get) => ({
  history: [],
  settings: defaultSettings,
  addRecord: (record) =>
    set({
      history: [record, ...get().history].slice(0, 100), // 最多保留100条
    }),
  clearHistory: () => set({ history: [] }),
  updateSettings: (newSettings) =>
    set({
      settings: { ...get().settings, ...newSettings },
    }),
}));

export type TScanStoreState = IScanState & IHydrationState;
