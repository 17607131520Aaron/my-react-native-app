/**
 * 扫描动画组件
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { SCAN_ANIMATION_DURATION, SCAN_ANIMATION_HEIGHT } from '../constants';

import type { IScanArea } from '../types';

interface IScanAnimationProps {
  /** 是否显示动画 */
  isVisible?: boolean;
  /** 扫描区域配置 */
  scanArea: IScanArea;
}

const SCAN_LINE_COLOR = '#00FF00';

/**
 * 扫描动画组件
 */
export function ScanAnimation({
  isVisible = true,
  scanArea,
}: IScanAnimationProps): React.ReactElement | null {
  // 使用 useState 来存储 Animated.Value，这样可以在渲染时安全访问
  const [translateY] = useState(() => new Animated.Value(0));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!isVisible) {
      // 停止动画
      animationRef.current?.stop();
      translateY.setValue(0);
      return;
    }

    // 创建循环动画
    const newAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: scanArea.height - SCAN_ANIMATION_HEIGHT,
          duration: SCAN_ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: SCAN_ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );

    animationRef.current = newAnimation;
    newAnimation.start();

    return () => {
      newAnimation.stop();
    };
  }, [isVisible, scanArea.height, translateY]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: scanArea.topOffset,
        height: scanArea.height,
        left: '50%' as const,
        marginLeft: -scanArea.width / 2,
        width: scanArea.width,
      },
    ],
    [scanArea.topOffset, scanArea.height, scanArea.width],
  );

  const animatedStyle = useMemo(
    () => [styles.scanLine, { transform: [{ translateY }] }],
    [translateY],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <View pointerEvents='none' style={containerStyle}>
      <Animated.View style={animatedStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: SCAN_ANIMATION_HEIGHT,
    backgroundColor: SCAN_LINE_COLOR,
    shadowColor: SCAN_LINE_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default ScanAnimation;
