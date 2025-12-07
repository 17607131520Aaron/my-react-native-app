/**
 * RecognitionFrame - 识别框 UI 组件
 * 扫码成功后显示的矩形框，用于标识扫描位置
 *
 * @module CodeScanner/RecognitionFrame
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import type { IBarcodeRect, IRecognitionFrameProps, TRecognitionFrameType } from './types';

// 颜色常量
const COLOR_NEW = '#00FF00'; // 绿色=新条码
const COLOR_CACHED = '#FFFF00'; // 黄色=已缓存
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

/**
 * 获取识别框颜色
 * @param type - 识别框类型
 * @returns 边框颜色
 */
const getFrameColor = (type: TRecognitionFrameType): string => {
  return type === 'new' ? COLOR_NEW : COLOR_CACHED;
};

/**
 * 识别框组件
 * 显示扫码成功后的识别区域，支持自动隐藏动画
 */
export const RecognitionFrame: React.FC<IRecognitionFrameProps> = ({
  visible,
  type,
  bounds,
  duration = 500,
  onHide,
}) => {
  // 使用 useState 存储 Animated.Value，这样可以在渲染时安全访问
  const [opacity] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(0.8));
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // 显示动画
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // 设置自动隐藏定时器
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        // 隐藏动画
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);
    } else {
      // 立即隐藏
      opacity.setValue(0);
      scale.setValue(0.8);
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [visible, duration, onHide, opacity, scale]);

  const frameColor = getFrameColor(type);
  const frameStyle = bounds
    ? {
        position: 'absolute' as const,
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
      }
    : styles.defaultFrame;

  // 不显示时返回空容器（保持 hooks 调用顺序一致）
  if (!visible) {
    return <View />;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        frameStyle,
        {
          borderColor: frameColor,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

/**
 * RecognitionFrame 组件属性（重新导出以便外部使用）
 */
export type { IBarcodeRect, IRecognitionFrameProps };

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: TRANSPARENT,
  },
  defaultFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 100,
    marginLeft: -100,
    marginTop: -50,
  },
});
