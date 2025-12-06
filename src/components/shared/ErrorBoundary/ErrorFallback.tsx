/**
 * 错误降级 UI 组件
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';

/** ErrorFallback 属性 */
export interface IErrorFallbackProps {
  /** 错误对象 */
  error: Error | null;
  /** 重试回调 */
  onRetry?: () => void;
}

/**
 * 默认错误降级 UI
 */
export const ErrorFallback: React.FC<IErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>出错了</Text>
      <Text style={styles.message}>{error?.message ?? '发生了未知错误'}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>重试</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.backgroundSecondary,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
