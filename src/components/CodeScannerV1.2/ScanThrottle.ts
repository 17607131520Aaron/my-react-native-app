/**
 * ScanThrottle - 扫码节流控制类
 * 控制扫码频率，防止快速重复触发
 *
 * @module CodeScanner/ScanThrottle
 */

/**
 * 扫码节流控制类
 *
 * 功能：
 * - 基于时间戳的节流控制
 * - 支持动态调整扫码间隔
 * - 支持获取剩余等待时间
 */
export class ScanThrottle {
  private intervalMs: number;
  private lastScanTimestamp: number | null;

  /**
   * 创建一个新的 ScanThrottle 实例
   * @param intervalMs - 扫码之间的最小时间间隔（毫秒）
   */
  constructor(intervalMs: number) {
    this.intervalMs = intervalMs;
    this.lastScanTimestamp = null;
  }

  /**
   * 根据节流间隔检查是否可以执行扫码
   * @returns 如果距离上次扫码已过足够时间返回 true，否则返回 false
   */
  canScan(): boolean {
    if (this.lastScanTimestamp === null) {
      return true;
    }

    const now = Date.now();
    return now - this.lastScanTimestamp >= this.intervalMs;
  }

  /**
   * 记录一次扫码，更新上次扫码时间戳
   */
  recordScan(): void {
    this.lastScanTimestamp = Date.now();
  }

  /**
   * 重置节流状态，允许立即扫码
   */
  reset(): void {
    this.lastScanTimestamp = null;
  }

  /**
   * 获取距离下次允许扫码的剩余时间
   * @returns 距离下次允许扫码的时间（毫秒），如果现在就可以扫码则返回 0
   */
  getRemainingTime(): number {
    if (this.lastScanTimestamp === null) {
      return 0;
    }

    const now = Date.now();
    const elapsed = now - this.lastScanTimestamp;
    const remaining = this.intervalMs - elapsed;

    return Math.max(0, remaining);
  }

  /**
   * 动态调整扫码间隔
   * @param intervalMs - 新的扫码间隔（毫秒）
   */
  setInterval(intervalMs: number): void {
    this.intervalMs = intervalMs;
  }

  /**
   * 获取当前扫码间隔
   * @returns 当前扫码间隔（毫秒）
   */
  getInterval(): number {
    return this.intervalMs;
  }
}
