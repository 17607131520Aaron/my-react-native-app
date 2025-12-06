/**
 * ScanThrottle - Controls the minimum time interval between scans
 * Prevents rapid repeated scans by enforcing a configurable delay
 */

/**
 * ScanThrottle class for managing scan rate limiting
 * Enforces a minimum time interval between successful scans
 */
export class ScanThrottle {
  private intervalMs: number;
  private lastScanTimestamp: number | null;

  /**
   * Creates a new ScanThrottle instance
   * @param intervalMs - Minimum time interval between scans in milliseconds
   */
  constructor(intervalMs: number) {
    this.intervalMs = intervalMs;
    this.lastScanTimestamp = null;
  }

  /**
   * Checks if a scan can be performed based on the throttle interval
   * @returns true if enough time has passed since the last scan, false otherwise
   */
  canScan(): boolean {
    // If interval is 0 or negative, always allow scanning
    if (this.intervalMs <= 0) {
      return true;
    }

    // If no scan has been recorded yet, allow scanning
    if (this.lastScanTimestamp === null) {
      return true;
    }

    // Check if enough time has passed since the last scan
    const now = Date.now();
    return now - this.lastScanTimestamp >= this.intervalMs;
  }

  /**
   * Records a scan, updating the last scan timestamp
   */
  recordScan(): void {
    this.lastScanTimestamp = Date.now();
  }

  /**
   * Resets the throttle state, allowing immediate scanning
   */
  reset(): void {
    this.lastScanTimestamp = null;
  }

  /**
   * Gets the remaining time until the next scan is allowed
   * @returns Time in milliseconds until next scan is allowed, or 0 if scanning is allowed now
   */
  getRemainingTime(): number {
    // If interval is 0 or negative, no waiting required
    if (this.intervalMs <= 0) {
      return 0;
    }

    // If no scan has been recorded yet, no waiting required
    if (this.lastScanTimestamp === null) {
      return 0;
    }

    const now = Date.now();
    const elapsed = now - this.lastScanTimestamp;
    const remaining = this.intervalMs - elapsed;

    return remaining > 0 ? remaining : 0;
  }
}
