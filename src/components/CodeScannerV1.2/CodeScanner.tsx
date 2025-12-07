/**
 * CodeScanner - 条形码/二维码扫描主组件
 * 基于 react-native-camera-kit 构建，提供完整的扫码能力
 *
 * @module CodeScanner/CodeScanner
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import { RecognitionFrame } from './RecognitionFrame';
import { ScanFrame } from './ScanFrame';
import {
  DEFAULT_QUICK_SCAN_CONFIG,
  DEFAULT_RECOGNITION_FRAME_DURATION,
  DEFAULT_SCAN_INTERVAL,
} from './types';
import { useCodeScanner } from './useCodeScanner';
import { useRecognitionFrame } from './useRecognitionFrame';
import { useScannerLifecycle } from './useScannerLifecycle';

import type { ICodeScannerProps, IScanError, IScanResult, TRecognitionFrameType } from './types';

/**
 * 获取相机权限
 */
const getCameraPermission = ():
  | typeof PERMISSIONS.IOS.CAMERA
  | typeof PERMISSIONS.ANDROID.CAMERA => {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.CAMERA;
  }
  return PERMISSIONS.ANDROID.CAMERA;
};

/**
 * 创建扫码错误对象
 */
const createScanError = (
  type: IScanError['type'],
  message: string,
  originalError?: Error,
): IScanError => ({
  type,
  message,
  originalError,
});

/**
 * CodeScanner 主组件
 *
 * 功能：
 * - 条形码/二维码扫描
 * - 重复检测和缓存
 * - 扫码节流
 * - 震动反馈
 * - 识别框可视化
 * - 快速扫码模式
 * - 生命周期管理
 */
export const CodeScanner: React.FC<ICodeScannerProps> = ({
  // 回调函数
  onScan,
  onDuplicateScan,
  onPermissionDenied,
  onError,

  // 扫码配置
  scanInterval = DEFAULT_SCAN_INTERVAL,
  scanDelay = 0,
  enableDuplicateDetection = true,
  allowDuplicateScan = false,
  duplicateNotificationInterval,

  // 缓存配置
  cacheConfig,

  // 快速扫码模式
  quickScanMode = false,
  quickScanConfig,

  // 反馈配置
  enableVibration = true,
  vibrationConfig,

  // 识别框配置
  showRecognitionFrame = true,
  recognitionFrameDuration = DEFAULT_RECOGNITION_FRAME_DURATION,

  // UI 配置
  showScanFrame = true,
  scanFrameStyle,
  torchMode = 'off',
  paused = false,
  style,
}) => {
  // 权限状态
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // 相机是否准备就绪
  const [isCameraReady, setIsCameraReady] = useState(false);
  // 上次扫描的码值，用于避免连续扫描同一个码
  const lastScannedValueRef = useRef<string | null>(null);
  // 连续扫描同一码的计数器
  const sameCodeCountRef = useRef<number>(0);
  // 扫描延迟定时器
  const scanDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 是否在延迟期间
  const [isInScanDelay, setIsInScanDelay] = useState(false);
  // 相机引用
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  // 对焦点位置
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  // 对焦点显示定时器
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 计算实际配置（考虑快速扫码模式）
  const actualScanInterval = quickScanMode
    ? quickScanConfig?.scanInterval ?? DEFAULT_QUICK_SCAN_CONFIG.scanInterval
    : scanInterval;

  const actualRecognitionDuration = quickScanMode
    ? quickScanConfig?.recognitionFrameDuration ??
      DEFAULT_QUICK_SCAN_CONFIG.recognitionFrameDuration
    : recognitionFrameDuration;

  // 使用 Hooks
  const {
    handleScan: processScan,
    isDuplicate,
    canNotifyDuplicate,
    updateDuplicateNotification,
    triggerSuccessVibration,
    triggerDuplicateVibration,
    triggerErrorVibration,
  } = useCodeScanner({
    scanInterval: actualScanInterval,
    enableDuplicateDetection,
    duplicateNotificationInterval,
    cacheConfig,
    enableVibration,
    vibrationConfig,
    quickScanMode,
  });

  const { shouldPause } = useScannerLifecycle({
    externalPaused: paused,
  });

  const { isFrameVisible, frameType, frameBounds, frameDuration, showFrame, hideFrame } =
    useRecognitionFrame({
      defaultDuration: actualRecognitionDuration,
    });

  // 检查和请求相机权限
  useEffect(() => {
    const checkPermission = async (): Promise<void> => {
      try {
        const permission = getCameraPermission();
        const result = await check(permission);

        switch (result) {
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
            setHasPermission(true);
            setIsCameraReady(true);
            break;
          case RESULTS.DENIED: {
            // 请求权限
            const requestResult = await request(permission);
            const isGranted =
              requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED;
            setHasPermission(isGranted);
            // 权限刚获取后，重置相机准备状态以触发重新初始化
            if (isGranted) {
              setIsCameraReady(false);
              // 延迟一帧后设置为准备就绪，确保相机组件重新挂载
              setTimeout(() => setIsCameraReady(true), 100);
            }
            if (requestResult === RESULTS.BLOCKED || requestResult === RESULTS.UNAVAILABLE) {
              onPermissionDenied?.(createScanError('permission', '相机权限被拒绝，请在设置中开启'));
            }
            break;
          }
          case RESULTS.BLOCKED:
          case RESULTS.UNAVAILABLE:
            setHasPermission(false);
            onPermissionDenied?.(createScanError('permission', '相机权限被拒绝或不可用'));
            break;
        }
      } catch (error) {
        setHasPermission(false);
        onError?.(
          createScanError(
            'permission',
            '检查相机权限时发生错误',
            error instanceof Error ? error : undefined,
          ),
        );
      }
    };

    checkPermission();
  }, [onPermissionDenied, onError]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scanDelayTimerRef.current) {
        clearTimeout(scanDelayTimerRef.current);
      }
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  // 处理点击对焦
  const handleTapToFocus = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      const { locationX, locationY } = event.nativeEvent;

      // 显示对焦点
      setFocusPoint({ x: locationX, y: locationY });

      // 清除之前的定时器
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }

      // 1.5秒后隐藏对焦点
      focusTimerRef.current = setTimeout(() => {
        setFocusPoint(null);
      }, 1500);

      // 点击后清除上次扫描记录，允许重新识别
      lastScannedValueRef.current = null;
      sameCodeCountRef.current = 0;
    },
    [],
  );

  // 处理扫码回调
  const handleCodeScanned = useCallback(
    (event: { nativeEvent: { codeStringValue: string; codeFormat?: string } }) => {
      if (shouldPause || !hasPermission || isInScanDelay) {
        return;
      }

      try {
        const { codeStringValue: value, codeFormat: codeType = 'unknown' } = event.nativeEvent;

        console.log(value, ' value');

        if (!value) {
          return;
        }

        // 如果和上次扫描的码值相同，增加计数
        if (value === lastScannedValueRef.current) {
          sameCodeCountRef.current += 1;
          // 连续识别同一个码超过 10 次后，短暂忽略它，给其他码机会
          if (sameCodeCountRef.current > 10) {
            // 重置计数，但保持记录，下次还是会跳过
            return;
          }
          return;
        }

        // 识别到新的码，重置计数
        sameCodeCountRef.current = 0;

        // 检查是否重复（在缓存中）
        const isDuplicateCode = isDuplicate(value);

        if (isDuplicateCode) {
          // 重复扫码
          const canNotify = canNotifyDuplicate(value);

          if (canNotify) {
            // 可以发送重复提示
            updateDuplicateNotification(value);
            triggerDuplicateVibration();

            if (showRecognitionFrame) {
              showFrame('cached' as TRecognitionFrameType, undefined, actualRecognitionDuration);
            }

            const result: IScanResult = {
              value,
              codeType,
              timestamp: Date.now(),
            };

            onDuplicateScan?.(result);

            if (allowDuplicateScan) {
              onScan(result);
            }
          }
        } else {
          // 新扫码
          const result = processScan(value, codeType);

          if (result) {
            // 记录本次扫描的码值
            lastScannedValueRef.current = value;

            triggerSuccessVibration();

            if (showRecognitionFrame) {
              showFrame('new' as TRecognitionFrameType, undefined, actualRecognitionDuration);
            }

            onScan(result);

            // 如果设置了扫描延迟，启动延迟期
            if (scanDelay > 0) {
              setIsInScanDelay(true);
              scanDelayTimerRef.current = setTimeout(() => {
                setIsInScanDelay(false);
                // 延迟结束后清除上次扫描记录，允许扫描新的码
                lastScannedValueRef.current = null;
              }, scanDelay);
            } else {
              // 没有延迟时，短暂延迟后清除记录，让用户可以移动到其他码
              setTimeout(() => {
                lastScannedValueRef.current = null;
              }, 500);
            }
          }
        }
      } catch (error) {
        triggerErrorVibration();
        onError?.(
          createScanError(
            'processing',
            '处理扫码结果时发生错误',
            error instanceof Error ? error : undefined,
          ),
        );
      }
    },
    [
      shouldPause,
      hasPermission,
      isInScanDelay,
      scanDelay,
      isDuplicate,
      canNotifyDuplicate,
      updateDuplicateNotification,
      processScan,
      triggerSuccessVibration,
      triggerDuplicateVibration,
      triggerErrorVibration,
      showRecognitionFrame,
      showFrame,
      actualRecognitionDuration,
      onScan,
      onDuplicateScan,
      allowDuplicateScan,
      onError,
    ],
  );

  // 如果没有权限或相机未准备好，不渲染相机
  if (hasPermission === false) {
    return <View style={[styles.container, style]} />;
  }

  // 权限检查中或相机未准备好时显示空容器
  const shouldRenderCamera = hasPermission === true && isCameraReady;

  return (
    <View style={[styles.container, style]}>
      {shouldRenderCamera && (
        <Camera
          ref={cameraRef}
          scanBarcode
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          cameraType={'back' as any}
          flashMode={torchMode}
          style={styles.camera}
          onReadCode={handleCodeScanned}
        />
      )}

      {/* 点击对焦触摸层 */}
      <Pressable style={styles.touchLayer} onPress={handleTapToFocus}>
        {/* 对焦点指示器 */}
        {focusPoint && (
          <View
            style={[
              styles.focusPoint,
              {
                left: focusPoint.x - 30,
                top: focusPoint.y - 30,
              },
            ]}
          />
        )}
      </Pressable>

      {/* 扫描框 */}
      {showScanFrame && (
        <View pointerEvents='none' style={styles.overlay}>
          <ScanFrame style={scanFrameStyle} />
        </View>
      )}

      {/* 识别框 */}
      {showRecognitionFrame && (
        <RecognitionFrame
          bounds={frameBounds ?? undefined}
          duration={frameDuration}
          type={frameType}
          visible={isFrameVisible}
          onHide={hideFrame}
        />
      )}
    </View>
  );
};

// 导出组件作为默认导出
export default CodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  touchLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  focusPoint: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: 'gold',
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
