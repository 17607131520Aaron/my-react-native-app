/**
 * NavigationBar 组件类型定义
 */

import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

/**
 * 右侧按钮配置
 */
export interface INavBarButton {
  /** 按钮唯一标识 */
  key: string;
  /** 按钮图标（React 元素） */
  icon?: ReactNode;
  /** 按钮文字 */
  text?: string;
  /** 点击回调 */
  onPress: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>;
  /** 文字样式 */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * 搜索框配置
 */
export interface INavBarSearchConfig {
  /** 占位文字 */
  placeholder?: string;
  /** 搜索值 */
  value?: string;
  /** 值变化回调 */
  onChangeText?: (text: string) => void;
  /** 提交回调 */
  onSubmit?: (text: string) => void;
  /** 自定义样式 */
  style?: StyleProp<ViewStyle>;
  /** 是否自动聚焦 */
  autoFocus?: boolean;
}

/**
 * NavigationBar 组件属性
 */
export interface INavigationBarProps {
  /** 标题文字 */
  title?: string;
  /** 自定义标题组件（优先级高于 title） */
  titleComponent?: ReactNode;
  /** 是否显示返回按钮，默认 true */
  showBack?: boolean;
  /** 自定义返回按钮图标 */
  backIcon?: ReactNode;
  /** 返回按钮点击回调（默认调用 navigation.goBack） */
  onBack?: () => void;
  /** 右侧按钮列表 */
  rightButtons?: INavBarButton[];
  /** 右侧自定义组件（优先级高于 rightButtons） */
  rightComponent?: ReactNode;
  /** 搜索框配置（显示在标题位置） */
  searchConfig?: INavBarSearchConfig;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 标题颜色 */
  titleColor?: string;
  /** 图标/按钮颜色 */
  tintColor?: string;
  /** 是否显示底部分割线 */
  showBorder?: boolean;
  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** 是否透明背景 */
  transparent?: boolean;
  /** 状态栏样式 */
  statusBarStyle?: 'light' | 'dark';
}
