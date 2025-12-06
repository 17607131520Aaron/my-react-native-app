/**
 * NavigationBar 自定义导航栏组件
 * 支持返回按钮、标题、右侧多按钮、搜索框等
 */

import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackArrowIcon, SearchIcon } from '~/components/icons';
import { useTheme } from '~/theme';

import type { INavigationBarProps } from './types';
import type { ReactNode } from 'react';

/**
 * NavigationBar 组件
 */
export const NavigationBar: React.FC<INavigationBarProps> = ({
  title,
  titleComponent,
  showBack = true,
  backIcon,
  onBack,
  rightButtons,
  rightComponent,
  searchConfig,
  backgroundColor,
  titleColor,
  tintColor,
  showBorder = true,
  style,
  titleStyle,
  transparent = false,
  statusBarStyle,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // 计算颜色
  const bgColor = transparent ? 'transparent' : backgroundColor ?? theme.colors.background;
  const textColor = titleColor ?? theme.colors.text;
  const iconColor = tintColor ?? theme.colors.primary;
  const barStyle = statusBarStyle ?? (theme.isDark ? 'light' : 'dark');

  // 返回处理
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [onBack, navigation]);

  // 渲染左侧区域
  const renderLeft = (): ReactNode => {
    if (!showBack) {
      return <View style={styles.sideContainer} />;
    }

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.sideContainer} onPress={handleBack}>
        {backIcon ?? <BackArrowIcon color={iconColor} />}
      </TouchableOpacity>
    );
  };

  // 渲染中间区域
  const renderCenter = (): ReactNode => {
    // 搜索框模式
    if (searchConfig) {
      return (
        <View style={[styles.searchContainer, searchConfig.style]}>
          <View style={styles.searchIconContainer}>
            <SearchIcon color={theme.colors.textSecondary} size={16} />
          </View>
          <TextInput
            autoFocus={searchConfig.autoFocus}
            placeholder={searchConfig.placeholder ?? '搜索'}
            placeholderTextColor={theme.colors.textSecondary}
            returnKeyType='search'
            style={[styles.searchInput, { color: textColor }]}
            value={searchConfig.value}
            onChangeText={searchConfig.onChangeText}
            onSubmitEditing={() => searchConfig.onSubmit?.(searchConfig.value ?? '')}
          />
        </View>
      );
    }

    // 自定义标题组件
    if (titleComponent) {
      return <View style={styles.centerContainer}>{titleComponent}</View>;
    }

    // 文字标题
    return (
      <View style={styles.centerContainer}>
        <Text numberOfLines={1} style={[styles.title, { color: textColor }, titleStyle]}>
          {title}
        </Text>
      </View>
    );
  };

  // 渲染右侧区域
  const renderRight = (): ReactNode => {
    // 自定义右侧组件
    if (rightComponent) {
      return <View style={styles.sideContainer}>{rightComponent}</View>;
    }

    // 右侧按钮列表
    if (rightButtons && rightButtons.length > 0) {
      return (
        <View style={[styles.sideContainer, styles.rightButtons]}>
          {rightButtons.map((button) => (
            <TouchableOpacity
              key={button.key}
              activeOpacity={0.7}
              disabled={button.disabled}
              style={[styles.rightButton, button.disabled && styles.buttonDisabled, button.style]}
              onPress={button.onPress}
            >
              {button.icon}
              {button.text && (
                <Text
                  style={[
                    styles.buttonText,
                    { color: button.disabled ? theme.colors.textSecondary : iconColor },
                    button.textStyle,
                  ]}
                >
                  {button.text}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return <View style={styles.sideContainer} />;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, paddingTop: insets.top },
        showBorder && styles.border,
        showBorder && { borderBottomColor: theme.colors.border },
        style,
      ]}
    >
      <StatusBar translucent backgroundColor='transparent' barStyle={`${barStyle}-content`} />
      <View style={styles.content}>
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </View>
    </View>
  );
};

const NAV_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sideContainer: {
    minWidth: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  // 搜索框样式
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
    marginHorizontal: 8,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  // 右侧按钮样式
  rightButtons: {
    flexDirection: 'row',
    minWidth: 'auto',
  },
  rightButton: {
    paddingHorizontal: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NavigationBar;
