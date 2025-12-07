/**
 * HapticFeedback - 震动反馈模块
 * 提供扫码成功、重复、错误等场景的触觉反馈
 *
 * @module CodeScanner/HapticFeedback
 */

import { Platform, Vibration } from 'react-native';

import { DEFAULT_VIBRATION_CONFIG } from './types';

import type { IVibrationConfig } from './types';

/**
 * 震动反馈类
 *
 * 功能：
 * - 成功扫码短震动
 * - 重复扫码双脉冲震动
 * - 错误长震动
 * - 支持启用/禁用控制
 * - 支持自定义震动模式
 */
export class HapticFeedback {
  private config: IVibrationConfig;
  private enabled: boolean;

  /**
   * 创建一个新的 HapticFeedback 实例
   * @param config - 可选的震动配置覆盖
   */
  constructor(config?: Partial<IVibrationConfig>) {
    this.config = {
      ...DEFAULT_VIBRATION_CONFIG,
      ...config,
    };
    this.enabled = true;
  }

  /**
   * 触发成功震动反馈
   * 用于新条码扫描成功时
   */
  triggerSuccess(): void {
    if (!this.enabled) {
      return;
    }
    this.vibrate(this.config.successPattern);
  }

  /**
   * 触发重复震动反馈
   * 用于扫描到已缓存的条码时
   */
  triggerDuplicate(): void {
    if (!this.enabled) {
      return;
    }
    this.vibrate(this.config.duplicatePattern);
  }

  /**
   * 触发错误震动反馈
   * 用于扫码发生错误时
   */
  triggerError(): void {
    if (!this.enabled) {
      return;
    }
    this.vibrate(this.config.errorPattern);
  }

  /**
   * 设置震动功能启用状态
   * @param enabled - 是否启用震动
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 获取震动功能启用状态
   * @returns 是否启用震动
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 更新震动配置
   * @param config - 要更新的配置项
   */
  updateConfig(config: Partial<IVibrationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 获取当前震动配置
   * @returns 当前震动配置
   */
  getConfig(): IVibrationConfig {
    return { ...this.config };
  }

  /**
   * 取消当前震动
   */
  cancel(): void {
    Vibration.cancel();
  }

  /**
   * 执行震动
   * @param pattern - 震动模式数组
   */
  private vibrate(pattern: number[]): void {
    if (pattern.length === 0) {
      return;
    }

    if (pattern.length === 1) {
      // 单次震动
      Vibration.vibrate(pattern[0]);
    } else {
      // 模式震动
      // Android: 数组表示 [等待, 震动, 等待, 震动, ...]
      // iOS: 数组表示震动时长序列
      if (Platform.OS === 'android') {
        // Android 需要在开头添加 0 表示立即开始
        Vibration.vibrate([0, ...pattern]);
      } else {
        // iOS 使用简单的震动时长
        Vibration.vibrate(pattern);
      }
    }
  }
}
