/**
 * ScanFrame - 扫描框 UI 组件
 * 显示扫描引导框，帮助用户对准条码
 *
 * @module CodeScanner/ScanFrame
 */

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

/**
 * ScanFrame 组件属性
 */
export interface IScanFrameProps {
  /** 自定义样式 */
  style?: ViewStyle;
  /** 边框颜色 */
  borderColor?: string;
  /** 边框宽度 */
  borderWidth?: number;
  /** 角标长度 */
  cornerLength?: number;
  /** 扫描框大小 */
  size?: number;
}

/**
 * 扫描框组件
 * 显示四个角标的扫描引导框
 */
export const ScanFrame: React.FC<IScanFrameProps> = ({
  style,
  borderColor = '#00FF00',
  borderWidth = 3,
  cornerLength = 20,
  size = 250,
}) => {
  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, { width: size, height: size }, style],
    [size, style],
  );

  const cornerBaseStyle = useMemo<ViewStyle>(
    () => ({
      width: cornerLength,
      height: cornerLength,
      borderColor,
      borderWidth,
    }),
    [cornerLength, borderColor, borderWidth],
  );

  const topLeftStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.corner, styles.topLeft, cornerBaseStyle, styles.topLeftBorder],
    [cornerBaseStyle],
  );

  const topRightStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.corner, styles.topRight, cornerBaseStyle, styles.topRightBorder],
    [cornerBaseStyle],
  );

  const bottomLeftStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.corner, styles.bottomLeft, cornerBaseStyle, styles.bottomLeftBorder],
    [cornerBaseStyle],
  );

  const bottomRightStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.corner, styles.bottomRight, cornerBaseStyle, styles.bottomRightBorder],
    [cornerBaseStyle],
  );

  return (
    <View style={containerStyle}>
      {/* 左上角 */}
      <View style={topLeftStyle} />
      {/* 右上角 */}
      <View style={topRightStyle} />
      {/* 左下角 */}
      <View style={bottomLeftStyle} />
      {/* 右下角 */}
      <View style={bottomRightStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  topLeftBorder: {
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRightBorder: {
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeftBorder: {
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRightBorder: {
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
