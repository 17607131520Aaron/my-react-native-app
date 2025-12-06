/**
 * ScanFrame 组件
 * CodeScanner 的可视化扫描引导覆盖层
 */

import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface IScanFrameProps {
  /** 扫描框的自定义样式 */
  style?: ViewStyle;
}

/**
 * ScanFrame 组件显示可视化扫描引导
 */
export const ScanFrame: React.FC<IScanFrameProps> = ({ style }) => {
  return (
    <View pointerEvents='none' style={styles.overlay}>
      <View style={[styles.frame, style]}>
        {/* 角落指示器 */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
    </View>
  );
};

const FRAME_SIZE = 250;
const CORNER_SIZE = 20;
const CORNER_WIDTH = 3;
const CORNER_COLOR = '#00FF00';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
});

export default ScanFrame;
