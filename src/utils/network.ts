import NetInfo from '@react-native-community/netinfo';

import type { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

// 网络状态监听器接口
type TNetworkListener = (state: NetInfoState) => void;

// 存储所有监听器
const listeners: TNetworkListener[] = [];

// 当前网络状态
let currentNetworkState: NetInfoState | null = null;

// 初始化网络监听
const initNetworkMonitoring = (): NetInfoSubscription => {
  // 取消之前的订阅
  const unsubscribe = NetInfo.addEventListener((state) => {
    currentNetworkState = state;
    // 通知所有监听器
    listeners.forEach((listener) => listener(state));
  });

  // 初始获取网络状态
  NetInfo.fetch().then((state) => {
    currentNetworkState = state;
  });

  // 返回取消订阅函数，实际上不会用到，因为我们希望网络监听一直存在
  return unsubscribe;
};

// 添加网络状态监听器
export const addNetworkListener = (listener: TNetworkListener): (() => void) => {
  listeners.push(listener);

  // 如果已有网络状态，立即通知新监听器
  if (currentNetworkState) {
    listener(currentNetworkState);
  }

  // 返回移除监听器的函数
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

// 获取当前网络状态
export const getCurrentNetworkState = (): Promise<NetInfoState> => {
  if (currentNetworkState) {
    return Promise.resolve(currentNetworkState);
  }
  return NetInfo.fetch();
};

// 检查网络是否连接
export const isNetworkConnected = async (): Promise<boolean> => {
  const state = await getCurrentNetworkState();
  return state.isConnected === true;
};

// 检查是否为WIFI连接
export const isWifiConnected = async (): Promise<boolean> => {
  const state = await getCurrentNetworkState();
  return state.isConnected === true && state.type === 'wifi';
};

// 初始化网络监听
initNetworkMonitoring();
