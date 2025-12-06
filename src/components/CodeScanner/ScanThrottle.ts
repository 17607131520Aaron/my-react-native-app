/**
 * ScanThrottle - 控制扫码之间的最小时间间隔
 * 通过强制可配置的延迟来防止快速重复扫码
 */

/**
 * ScanThrottle 类用于管理扫码速率限制
 * 强制成功扫码之间的最小时间间隔
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
    // 如果间隔为 0 或负数，始终允许扫码
    if (this.intervalMs <= 0) {
      return true;
    }

    // 如果还没有记录扫码，允许扫码
    if (this.lastScanTimestamp === null) {
      return true;
    }

    // 检查距离上次扫码是否已过足够时间
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
    // 如果间隔为 0 或负数，无需等待
    if (this.intervalMs <= 0) {
      return 0;
    }

    // 如果还没有记录扫码，无需等待
    if (this.lastScanTimestamp === null) {
      return 0;
    }

    const now = Date.now();
    const elapsed = now - this.lastScanTimestamp;
    const remaining = this.intervalMs - elapsed;

    return remaining > 0 ? remaining : 0;
  }
}
