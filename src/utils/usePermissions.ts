/**
 * usePermissions - 权限管理 Hook
 * 基于 react-native-permissions 封装的通用权限管理工具
 */

import { useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

import type { Permission, PermissionStatus } from 'react-native-permissions';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 权限类型枚举
 */
export type TPermissionType =
  | 'camera'
  | 'microphone'
  | 'photoLibrary'
  | 'location'
  | 'locationAlways'
  | 'contacts'
  | 'calendar'
  | 'bluetooth';

/**
 * 权限状态
 */
export type TPermissionState = 'granted' | 'denied' | 'blocked' | 'unavailable' | 'limited';

/**
 * 权限检查结果
 */
export interface IPermissionResult {
  /** 是否已授权 */
  isGranted: boolean;
  /** 权限状态 */
  status: TPermissionState;
  /** 是否可以再次请求（未被永久拒绝） */
  canRequest: boolean;
}

/**
 * 多权限检查结果
 */
export interface IMultiplePermissionResult {
  /** 所有权限是否都已授权 */
  isAllGranted: boolean;
  /** 各权限的详细结果 */
  results: Record<TPermissionType, IPermissionResult>;
}

/**
 * Hook 返回值
 */
export interface IUsePermissionsReturn {
  /** 检查单个权限 */
  checkPermission: (type: TPermissionType) => Promise<IPermissionResult>;
  /** 请求单个权限 */
  requestPermission: (type: TPermissionType, rationale?: string) => Promise<IPermissionResult>;
  /** 检查多个权限 */
  checkMultiplePermissions: (types: TPermissionType[]) => Promise<IMultiplePermissionResult>;
  /** 请求多个权限 */
  requestMultiplePermissions: (types: TPermissionType[]) => Promise<IMultiplePermissionResult>;
  /** 打开系统设置 */
  openAppSettings: () => Promise<void>;
  /** 显示权限被拒绝的提示弹窗 */
  showPermissionDeniedAlert: (permissionName: string, onOpenSettings?: () => void) => void;
  /** 当前是否正在请求权限 */
  isRequesting: boolean;
}

// ============================================================================
// 权限映射
// ============================================================================

/**
 * 获取 Android 版本号
 */
const getAndroidVersion = (): number => {
  if (Platform.OS !== 'android') {
    return 0;
  }
  const version = Platform.Version;
  return typeof version === 'number' ? version : parseInt(String(version), 10) || 0;
};

/**
 * 获取平台对应的权限常量
 */
const getPermission = (type: TPermissionType): Permission | null => {
  const androidVersion = getAndroidVersion();

  const permissionMap: Record<
    TPermissionType,
    { ios: Permission | null; android: Permission | null }
  > = {
    camera: {
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    },
    microphone: {
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    },
    photoLibrary: {
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android:
        androidVersion >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    },
    location: {
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    },
    locationAlways: {
      ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
      android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    },
    contacts: {
      ios: PERMISSIONS.IOS.CONTACTS,
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
    },
    calendar: {
      ios: PERMISSIONS.IOS.CALENDARS,
      android: PERMISSIONS.ANDROID.READ_CALENDAR,
    },
    bluetooth: {
      ios: PERMISSIONS.IOS.BLUETOOTH,
      android: androidVersion >= 31 ? PERMISSIONS.ANDROID.BLUETOOTH_CONNECT : null,
    },
  };

  const platformPermission = permissionMap[type];
  if (!platformPermission) {
    return null;
  }

  return Platform.OS === 'ios' ? platformPermission.ios : platformPermission.android;
};

/**
 * 权限名称映射（用于提示文案）
 */
const permissionNames: Record<TPermissionType, string> = {
  camera: '相机',
  microphone: '麦克风',
  photoLibrary: '相册',
  location: '位置',
  locationAlways: '后台位置',
  contacts: '通讯录',
  calendar: '日历',
  bluetooth: '蓝牙',
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 将 react-native-permissions 的状态转换为统一状态
 */
const convertStatus = (status: PermissionStatus): TPermissionState => {
  switch (status) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    case RESULTS.LIMITED:
      return 'limited';
    default:
      return 'denied';
  }
};

/**
 * 判断权限是否已授权
 */
const checkIsGranted = (status: PermissionStatus): boolean => {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
};

/**
 * 判断是否可以再次请求权限
 */
const canRequestAgain = (status: PermissionStatus): boolean => {
  return status === RESULTS.DENIED;
};

// ============================================================================
// Hook 实现
// ============================================================================

/**
 * 权限管理 Hook
 *
 * @example
 * ```tsx
 * const { checkPermission, requestPermission, openAppSettings } = usePermissions();
 *
 * // 检查相机权限
 * const result = await checkPermission('camera');
 * if (!result.isGranted) {
 *   const requestResult = await requestPermission('camera', '需要相机权限来扫描二维码');
 *   if (!requestResult.isGranted && !requestResult.canRequest) {
 *     showPermissionDeniedAlert('相机');
 *   }
 * }
 * ```
 */
export function usePermissions(): IUsePermissionsReturn {
  const [isRequesting, setIsRequesting] = useState(false);

  /**
   * 检查单个权限
   */
  const checkPermission = async (type: TPermissionType): Promise<IPermissionResult> => {
    const permission = getPermission(type);

    if (!permission) {
      return {
        isGranted: true,
        status: 'unavailable',
        canRequest: false,
      };
    }

    try {
      const status = await check(permission);
      return {
        isGranted: checkIsGranted(status),
        status: convertStatus(status),
        canRequest: canRequestAgain(status),
      };
    } catch (error) {
      console.error(`检查权限失败 [${type}]:`, error);
      return {
        isGranted: false,
        status: 'denied',
        canRequest: false,
      };
    }
  };

  /**
   * 请求单个权限
   */
  const requestPermission = async (
    type: TPermissionType,
    _rationale?: string,
  ): Promise<IPermissionResult> => {
    const permission = getPermission(type);

    if (!permission) {
      return {
        isGranted: true,
        status: 'unavailable',
        canRequest: false,
      };
    }

    setIsRequesting(true);

    try {
      const currentStatus = await check(permission);

      if (checkIsGranted(currentStatus)) {
        return {
          isGranted: true,
          status: convertStatus(currentStatus),
          canRequest: false,
        };
      }

      if (currentStatus === RESULTS.BLOCKED) {
        return {
          isGranted: false,
          status: 'blocked',
          canRequest: false,
        };
      }

      const status = await request(permission);

      return {
        isGranted: checkIsGranted(status),
        status: convertStatus(status),
        canRequest: canRequestAgain(status),
      };
    } catch (error) {
      console.error(`请求权限失败 [${type}]:`, error);
      return {
        isGranted: false,
        status: 'denied',
        canRequest: false,
      };
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * 检查多个权限
   */
  const checkMultiplePermissions = async (
    types: TPermissionType[],
  ): Promise<IMultiplePermissionResult> => {
    const results = {} as Record<TPermissionType, IPermissionResult>;
    let isAllGranted = true;

    for (const type of types) {
      const result = await checkPermission(type);
      results[type] = result;
      if (!result.isGranted) {
        isAllGranted = false;
      }
    }

    return { isAllGranted, results };
  };

  /**
   * 请求多个权限
   */
  const requestMultiplePermissions = async (
    types: TPermissionType[],
  ): Promise<IMultiplePermissionResult> => {
    const permissions = types
      .map((type) => ({ type, permission: getPermission(type) }))
      .filter(
        (item): item is { type: TPermissionType; permission: Permission } =>
          item.permission !== null,
      );

    if (permissions.length === 0) {
      const results = {} as Record<TPermissionType, IPermissionResult>;
      for (const type of types) {
        results[type] = { isGranted: true, status: 'unavailable', canRequest: false };
      }
      return { isAllGranted: true, results };
    }

    setIsRequesting(true);

    try {
      const permissionArray = permissions.map((p) => p.permission);
      const statuses = await requestMultiple(permissionArray);

      const results = {} as Record<TPermissionType, IPermissionResult>;
      let isAllGranted = true;

      for (const { type, permission } of permissions) {
        const status = statuses[permission];
        const isGranted = checkIsGranted(status);
        results[type] = {
          isGranted,
          status: convertStatus(status),
          canRequest: canRequestAgain(status),
        };
        if (!isGranted) {
          isAllGranted = false;
        }
      }

      for (const type of types) {
        if (!results[type]) {
          results[type] = { isGranted: true, status: 'unavailable', canRequest: false };
        }
      }

      return { isAllGranted, results };
    } catch (error) {
      console.error('请求多个权限失败:', error);
      const results = {} as Record<TPermissionType, IPermissionResult>;
      for (const type of types) {
        results[type] = { isGranted: false, status: 'denied', canRequest: false };
      }
      return { isAllGranted: false, results };
    } finally {
      setIsRequesting(false);
    }
  };

  /**
   * 打开系统设置
   */
  const openAppSettings = async (): Promise<void> => {
    try {
      await openSettings();
    } catch (error) {
      console.error('打开设置失败:', error);
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      }
    }
  };

  /**
   * 显示权限被拒绝的提示弹窗
   */
  const showPermissionDeniedAlert = (permissionName: string, onOpenSettings?: () => void): void => {
    Alert.alert(
      '权限被拒绝',
      `${permissionName}权限已被拒绝，请在系统设置中开启`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '去设置',
          onPress: () => {
            onOpenSettings?.();
            openAppSettings();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return {
    checkPermission,
    requestPermission,
    checkMultiplePermissions,
    requestMultiplePermissions,
    openAppSettings,
    showPermissionDeniedAlert,
    isRequesting,
  };
}

// ============================================================================
// 便捷导出
// ============================================================================

export { permissionNames };
export default usePermissions;
