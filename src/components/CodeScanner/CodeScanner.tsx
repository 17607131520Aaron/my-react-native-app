/**
 * CodeScanner 组件
 * 基于 react-native-camera-kit 的条形码/二维码扫描组件
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import ScanFrame from './ScanFrame';
import { useCodeScanner } from './useCodeScanner';
import { useScannerLifecycle } from './useScannerLifecycle';

import type { ICodeScannerProps } from './types';
import type { Permission } from 'react-native-permissions';

// 根据平台获取相机权限
const CAMERA_PERMISSION: Permission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});

/**
 * 用于扫描二维码和条形码的 CodeScanner 组件
 */
export const CodeScanner: React.FC<ICodeScannerProps> = ({
  onScan,
  onDuplicateScan,
  onPermissionDenied,
  scanInterval = 1000,
  enableDuplicateDetection = true,
  allowDuplicateScan = false,
  cacheConfig,
  paused = false,
  torchMode = 'off',
  showScanFrame = true,
  scanFrameStyle,
  style,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { handleScan, isDuplicate } = useCodeScanner({
    scanInterval,
    cacheConfig,
    enableDuplicateDetection,
  });

  // 基于 App 状态和导航焦点管理生命周期
  const { shouldPause } = useScannerLifecycle({
    isExternalPaused: paused,
  });

  // 组件挂载时请求相机权限
  useEffect(() => {
    const requestCameraPermission = async (): Promise<void> => {
      try {
        // 首先检查当前权限状态
        const currentStatus = await check(CAMERA_PERMISSION);

        switch (currentStatus) {
          case RESULTS.GRANTED:
            // 权限已授予
            setHasPermission(true);
            break;

          case RESULTS.DENIED: {
            // 权限未请求过，请求权限
            const requestResult = await request(CAMERA_PERMISSION);
            if (requestResult === RESULTS.GRANTED) {
              setHasPermission(true);
            } else {
              setHasPermission(false);
              onPermissionDenied?.();
            }
            break;
          }

          case RESULTS.BLOCKED:
            // 权限被永久拒绝，需要引导用户去设置
            setHasPermission(false);
            onPermissionDenied?.();
            // 可选：打开设置页面
            // Linking.openSettings();
            break;

          case RESULTS.UNAVAILABLE:
            // 设备不支持相机
            setHasPermission(false);
            onPermissionDenied?.();
            break;

          case RESULTS.LIMITED:
            // iOS 14+ 有限访问（对于相机通常等同于授权）
            setHasPermission(true);
            break;

          default:
            setHasPermission(false);
            onPermissionDenied?.();
        }
      } catch (error) {
        console.error('Camera permission error:', error);
        setHasPermission(false);
        onPermissionDenied?.();
      }
    };

    requestCameraPermission();
  }, [onPermissionDenied]);

  /**
   * 处理相机读取条码事件
   */
  const handleReadCode = useCallback(
    (event: { nativeEvent: { codeStringValue: string; codeFormat?: string } }) => {
      // 使用 shouldPause，它综合考虑了 App 状态、导航焦点和外部暂停属性
      if (shouldPause) {
        return;
      }

      const { codeStringValue, codeFormat } = event.nativeEvent;
      const codeType = codeFormat ?? 'unknown';

      // 检查是否重复扫码
      const isDuplicateScan = isDuplicate(codeStringValue);

      // 通过 hook 处理扫码
      const result = handleScan(codeStringValue, codeType);

      if (!result) {
        // 被节流，忽略
        return;
      }

      if (isDuplicateScan) {
        // 通知重复扫码
        onDuplicateScan?.(result);

        // 只有当 allowDuplicateScan 为 true 时才调用 onScan
        if (allowDuplicateScan) {
          onScan(result);
        }
      } else {
        // 新扫码
        onScan(result);
      }
    },
    [shouldPause, isDuplicate, handleScan, onDuplicateScan, allowDuplicateScan, onScan],
  );

  // 处理权限被拒绝
  if (hasPermission === false) {
    onPermissionDenied?.();
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Camera
        cameraType={CameraType.Back}
        scanBarcode={!shouldPause}
        showFrame={false}
        style={styles.camera}
        torchMode={torchMode}
        onReadCode={handleReadCode}
      />
      {showScanFrame && <ScanFrame style={scanFrameStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
});

export default CodeScanner;
