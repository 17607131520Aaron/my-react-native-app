/**
 * ScanCode 扫码组件
 * 基于 react-native-camera-kit 实现的扫码组件
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

import { usePermissions } from '~/utils/usePermissions';

import { MaskOverlay, ScanAnimation } from './components';
import { DEFAULT_CACHE_TIMEOUT, DEFAULT_CODE_TYPES, DEFAULT_SCAN_INTERVAL } from './constants';
import { useLifecycleManager, useScanCodeLogic } from './hooks';

import type { IRawScanResult, IScanCodeProps } from './types';

const { width: screenWidth } = Dimensions.get('window');

// 默认扫描区域
const DEFAULT_SCAN_AREA = {
  width: screenWidth * 0.8,
  height: 200,
  topOffset: 150,
};

/**
 * ScanCode 扫码组件
 */
export function ScanCode(props: IScanCodeProps): React.ReactElement {
  const {
    // 基础配置
    style,
    codeTypes = DEFAULT_CODE_TYPES,
    // 生命周期控制
    isActive = true,
    shouldPauseOnBlur = true,
    shouldPauseOnBackground = true,
    // 扫码区域
    scanArea = DEFAULT_SCAN_AREA,
    shouldLimitArea = false,
    maskColor,
    // 过滤配置
    includePatterns = [],
    excludePatterns = [],
    // 缓存配置
    isCacheEnabled = true,
    cacheTimeout = DEFAULT_CACHE_TIMEOUT,
    // 频率控制
    scanInterval = DEFAULT_SCAN_INTERVAL,
    scanTimeout,
    // 反馈配置
    isVibrationEnabled = true,
    isFlashlightEnabled = false,
    shouldShowScanAnimation = true,
    // 回调函数
    onCodeScanned,
    onMultipleCodesScanned,
    onCachedCodeScanned,
    onScanTimeout,
    onCameraPermissionDenied,
    onCameraError,
    // 子组件
    children,
  } = props;

  // ========== Refs ==========
  const isMountedRef = useRef(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);

  // ========== 权限管理 ==========
  const { requestPermission, checkPermission } = usePermissions();
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);

  // ========== 扫码逻辑 ==========
  const {
    isScanning,
    isFlashlightOn,
    handleCodeRead,
    pauseScanning,
    resumeScanning,
    toggleFlashlight,
    cleanup,
  } = useScanCodeLogic({
    codeTypes,
    scanArea,
    shouldLimitArea,
    includePatterns,
    excludePatterns,
    isCacheEnabled,
    cacheTimeout,
    scanInterval,
    scanTimeout,
    isVibrationEnabled,
    onCodeScanned,
    onMultipleCodesScanned,
    onCachedCodeScanned,
    onScanTimeout,
  });

  // ========== 生命周期管理 ==========
  const { isCameraActive } = useLifecycleManager({
    isActive,
    shouldPauseOnBlur,
    shouldPauseOnBackground,
    onPause: pauseScanning,
    onResume: resumeScanning,
    onTurnOffFlashlight: () => {
      if (isFlashlightOn) {
        toggleFlashlight();
      }
    },
  });

  // ========== 请求相机权限 ==========
  useEffect(() => {
    const requestCameraPermission = async (): Promise<void> => {
      try {
        // 先检查权限状态
        const checkResult = await checkPermission('camera');

        if (checkResult.isGranted) {
          setHasPermission(true);
          return;
        }

        // 如果权限被永久拒绝，直接回调
        if (!checkResult.canRequest) {
          setHasPermission(false);
          onCameraPermissionDenied?.();
          return;
        }

        // 请求权限
        const result = await requestPermission('camera', '需要相机权限来扫描条码');

        if (isMountedRef.current) {
          setHasPermission(result.isGranted);

          if (!result.isGranted) {
            onCameraPermissionDenied?.();
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          setHasPermission(false);
          onCameraError?.(error as Error);
        }
      }
    };

    requestCameraPermission();
  }, [checkPermission, requestPermission, onCameraPermissionDenied, onCameraError]);

  // ========== 组件卸载清理 ==========
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // ========== 处理闪光灯属性变化 ==========
  useEffect(() => {
    if (isFlashlightEnabled && !isFlashlightOn) {
      toggleFlashlight();
    } else if (!isFlashlightEnabled && isFlashlightOn) {
      toggleFlashlight();
    }
  }, [isFlashlightEnabled, isFlashlightOn, toggleFlashlight]);

  // ========== 处理扫码事件 ==========
  const handleReadCode = useCallback(
    (event: { nativeEvent: { codeStringValue: string; codeFormat: string } }) => {
      if (!isScanning || !isCameraActive) {
        return;
      }

      const rawResult: IRawScanResult = {
        codeStringValue: event.nativeEvent.codeStringValue,
        codeFormat: event.nativeEvent.codeFormat,
      };

      handleCodeRead([rawResult]);
    },
    [isScanning, isCameraActive, handleCodeRead],
  );

  // ========== 渲染 ==========

  // 权限检查中
  if (hasPermission === null) {
    return <View style={[styles.container, style]} />;
  }

  // 权限被拒绝
  if (hasPermission === false) {
    return <View style={[styles.container, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      {/* 相机预览 */}
      {isCameraActive && (
        <Camera
          ref={cameraRef}
          cameraType={CameraType.Back}
          flashMode={isFlashlightOn ? 'on' : 'off'}
          scanBarcode={isScanning}
          showFrame={false}
          style={styles.camera}
          onReadCode={handleReadCode}
        />
      )}

      {/* 遮罩层 */}
      {scanArea && <MaskOverlay maskColor={maskColor} scanArea={scanArea} />}

      {/* 扫描动画 */}
      {scanArea && shouldShowScanAnimation && (
        <ScanAnimation isVisible={isScanning && isCameraActive} scanArea={scanArea} />
      )}

      {/* 子组件 */}
      {children}
    </View>
  );
}

const CONTAINER_BACKGROUND_COLOR = '#000';

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: CONTAINER_BACKGROUND_COLOR,
  },
});

export default ScanCode;
