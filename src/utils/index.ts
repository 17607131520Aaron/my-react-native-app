/**
 * 工具函数
 * 提供通用的工具方法
 */

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);




  return d.toLocaleDateString('zh-CN');
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {


      func(...args);
    }, wait);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

