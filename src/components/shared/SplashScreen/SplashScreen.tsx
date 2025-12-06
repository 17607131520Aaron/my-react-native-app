/**
 * SplashScreen 启动屏组件
 * 应用启动时显示的加载界面
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ISplashScreenProps {
  /** 应用名称 */
  appName?: string;
  /** 副标题/slogan */
  subtitle?: string;
  /** 是否显示加载动画 */
  showLoading?: boolean;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 主色调 */
  primaryColor?: string;
}

/**
 * SplashScreen 启动屏组件
 */
export const SplashScreen: React.FC<ISplashScreenProps> = ({
  appName = '仓储管理',
  subtitle = '智能仓储解决方案',
  showLoading = true,
  backgroundColor = '#FFFFFF',
  primaryColor = '#007AFF',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
      <View style={styles.content}>
        {/* Logo 图标 */}
        <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
          <View style={styles.logoInner}>
            <View style={[styles.logoBox, styles.logoBox1]} />
            <View style={[styles.logoBox, styles.logoBox2]} />
            <View style={[styles.logoBox, styles.logoBox3]} />
            <View style={[styles.logoBox, styles.logoBox4]} />
          </View>
        </View>

        {/* 应用名称 */}
        <Text style={[styles.appName, { color: primaryColor }]}>{appName}</Text>

        {/* 副标题 */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* 加载指示器 */}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={primaryColor} size='small' />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}

      {/* 底部版权信息 */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.copyright}>© 2024 仓储管理系统</Text>
      </View>
    </View>
  );
};

// 启动屏使用固定颜色，不依赖主题（因为主题可能还未加载）
/* eslint-disable react-native/no-color-literals */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: {
    width: 56,
    height: 56,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  logoBox: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  logoBox1: {
    opacity: 1,
  },
  logoBox2: {
    opacity: 0.8,
  },
  logoBox3: {
    opacity: 0.6,
  },
  logoBox4: {
    opacity: 0.4,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});
/* eslint-enable react-native/no-color-literals */

export default SplashScreen;
