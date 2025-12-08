/**
 * 遮罩层组件
 */

import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { DEFAULT_MASK_COLOR } from '../constants';

import type { IScanArea } from '../types';

const { width: screenWidth } = Dimensions.get('window');

interface IMaskOverlayProps {
  /** 遮罩颜色 */
  maskColor?: string;
  /** 扫描区域配置 */
  scanArea: IScanArea;
}

/**
 * 遮罩层组件
 * 在扫描区域外显示半透明遮罩
 */
export function MaskOverlay({
  maskColor = DEFAULT_MASK_COLOR,
  scanArea,
}: IMaskOverlayProps): React.ReactElement {
  const scanLeft = (screenWidth - scanArea.width) / 2;

  const topMaskStyle = useMemo(
    () => [styles.mask, styles.maskTop, { height: scanArea.topOffset, backgroundColor: maskColor }],
    [scanArea.topOffset, maskColor],
  );

  const leftMaskStyle = useMemo(
    () => [
      styles.mask,
      styles.maskLeft,
      {
        top: scanArea.topOffset,
        width: scanLeft,
        height: scanArea.height,
        backgroundColor: maskColor,
      },
    ],
    [scanArea.topOffset, scanArea.height, scanLeft, maskColor],
  );

  const rightMaskStyle = useMemo(
    () => [
      styles.mask,
      styles.maskRight,
      {
        top: scanArea.topOffset,
        width: scanLeft,
        height: scanArea.height,
        backgroundColor: maskColor,
      },
    ],
    [scanArea.topOffset, scanArea.height, scanLeft, maskColor],
  );

  const bottomMaskStyle = useMemo(
    () => [
      styles.mask,
      styles.maskBottom,
      {
        top: scanArea.topOffset + scanArea.height,
        backgroundColor: maskColor,
      },
    ],
    [scanArea.topOffset, scanArea.height, maskColor],
  );

  const scanFrameStyle = useMemo(
    () => [
      styles.scanFrame,
      {
        top: scanArea.topOffset,
        left: scanLeft,
        width: scanArea.width,
        height: scanArea.height,
      },
    ],
    [scanArea.topOffset, scanArea.width, scanArea.height, scanLeft],
  );

  return (
    <View pointerEvents='none' style={styles.container}>
      {/* 顶部遮罩 */}
      <View style={topMaskStyle} />

      {/* 左侧遮罩 */}
      <View style={leftMaskStyle} />

      {/* 右侧遮罩 */}
      <View style={rightMaskStyle} />

      {/* 底部遮罩 */}
      <View style={bottomMaskStyle} />

      {/* 扫描框边框 */}
      <View style={scanFrameStyle}>
        {/* 四个角 */}
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>
    </View>
  );
}

const CORNER_SIZE = 20;
const CORNER_WIDTH = 3;
const CORNER_COLOR = '#00FF00';
const SCAN_FRAME_BORDER_COLOR = 'rgba(255, 255, 255, 0.3)';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
  },
  mask: {
    position: 'absolute',
  },
  maskBottom: {
    left: 0,
    right: 0,
    bottom: 0,
  },
  maskLeft: {
    left: 0,
  },
  maskRight: {
    right: 0,
  },
  maskTop: {
    top: 0,
    left: 0,
    right: 0,
  },
  scanFrame: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: SCAN_FRAME_BORDER_COLOR,
  },
});

export default MaskOverlay;
