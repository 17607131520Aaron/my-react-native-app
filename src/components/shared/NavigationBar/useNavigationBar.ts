/**
 * useNavigationBar Hook
 * 提供给页面组件动态控制导航栏的能力
 */

import { useNavigation } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import type { INavBarButton, INavBarSearchConfig, INavigationBarProps } from './types';

/**
 * 导航栏配置选项
 */
export interface INavigationBarOptions {
  /** 标题 */
  title?: string;
  /** 右侧按钮 */
  rightButtons?: INavBarButton[];
  /** 搜索配置 */
  searchConfig?: INavBarSearchConfig;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 标题颜色 */
  titleColor?: string;
  /** 图标颜色 */
  tintColor?: string;
  /** 是否显示底部边框 */
  showBorder?: boolean;
  /** 是否透明 */
  transparent?: boolean;
}

/**
 * useNavigationBar 返回值
 */
export interface IUseNavigationBarReturn {
  /** 当前导航栏配置 */
  navBarProps: Partial<INavigationBarProps>;
  /** 设置标题 */
  setTitle: (title: string) => void;
  /** 设置右侧按钮 */
  setRightButtons: (buttons: INavBarButton[]) => void;
  /** 设置搜索配置 */
  setSearchConfig: (config: INavBarSearchConfig | undefined) => void;
  /** 更新导航栏配置 */
  updateNavBar: (options: Partial<INavigationBarOptions>) => void;
  /** 显示/隐藏导航栏 */
  setVisible: (visible: boolean) => void;
  /** 导航栏是否可见 */
  isVisible: boolean;
}

/**
 * useNavigationBar Hook
 * 让页面组件可以动态控制导航栏
 *
 * @example
 * const { setTitle, setRightButtons } = useNavigationBar({
 *   title: '页面标题',
 *   rightButtons: [{ key: 'save', text: '保存', onPress: handleSave }]
 * });
 *
 * // 动态更新标题
 * useEffect(() => {
 *   setTitle(`已选择 ${count} 项`);
 * }, [count]);
 */
export function useNavigationBar(initialOptions?: INavigationBarOptions): IUseNavigationBarReturn {
  const navigation = useNavigation();

  const [options, setOptions] = useState<INavigationBarOptions>(initialOptions ?? {});
  const [isVisible, setIsVisible] = useState(true);

  // 设置原生导航栏隐藏（使用自定义导航栏时）
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 设置标题
  const setTitle = useCallback((title: string) => {
    setOptions((prev) => ({ ...prev, title }));
  }, []);

  // 设置右侧按钮
  const setRightButtons = useCallback((rightButtons: INavBarButton[]) => {
    setOptions((prev) => ({ ...prev, rightButtons }));
  }, []);

  // 设置搜索配置
  const setSearchConfig = useCallback((searchConfig: INavBarSearchConfig | undefined) => {
    setOptions((prev) => ({ ...prev, searchConfig }));
  }, []);

  // 更新导航栏配置
  const updateNavBar = useCallback((newOptions: Partial<INavigationBarOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
  }, []);

  // 显示/隐藏导航栏
  const setVisible = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, []);

  // 构建导航栏 props
  const navBarProps = useMemo<Partial<INavigationBarProps>>(
    () => ({
      title: options.title,
      rightButtons: options.rightButtons,
      searchConfig: options.searchConfig,
      showBack: options.showBack,
      backgroundColor: options.backgroundColor,
      titleColor: options.titleColor,
      tintColor: options.tintColor,
      showBorder: options.showBorder,
      transparent: options.transparent,
    }),
    [options],
  );

  return {
    navBarProps,
    setTitle,
    setRightButtons,
    setSearchConfig,
    updateNavBar,
    setVisible,
    isVisible,
  };
}
