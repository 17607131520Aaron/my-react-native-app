/**
 * withNavigationBar 高阶组件
 * 为页面组件自动添加自定义导航栏
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NavigationBar } from './NavigationBar';

import type { INavBarButton, INavigationBarProps } from './types';
import type { ComponentType, ReactNode } from 'react';

/**
 * 返回按钮配置
 */
export interface IBackIconConfig {
  /** 自定义图标组件 */
  icon?: ReactNode;
  /** 图标颜色 */
  color?: string;
  /** 图标大小 */
  size?: number;
}

/**
 * 注入给页面组件的导航栏控制 props
 */
export interface IWithNavigationBarProps {
  /** 导航栏控制对象 */
  navBar: {
    /** 更新导航栏配置 */
    update: (options: Partial<INavigationBarProps>) => void;
    /** 设置标题 */
    setTitle: (title: string) => void;
    /** 设置右侧按钮 */
    setRightButtons: (buttons: INavBarButton[]) => void;
    /** 设置右侧组件 */
    setRightComponent: (component: ReactNode) => void;
    /** 设置是否显示返回按钮 */
    setShowBack: (show: boolean) => void;
    /** 设置返回按钮点击回调 */
    setOnBack: (callback: (() => void) | undefined) => void;
    /**
     * 设置返回按钮图标配置
     * @example
     * navBar.setBackIcon({ icon: <CloseIcon />, color: '#FF0000', size: 28 });
     * navBar.setBackIcon({ color: '#333333' }); // 只改颜色
     */
    setBackIcon: (config: IBackIconConfig) => void;
    /** 设置导航栏可见性 */
    setVisible: (visible: boolean) => void;
    /** 设置背景颜色 */
    setBackgroundColor: (color: string) => void;
    /** 设置是否透明 */
    setTransparent: (transparent: boolean) => void;
    /** 设置是否显示底部边框 */
    setShowBorder: (show: boolean) => void;
    /** 设置图标颜色（返回按钮和右侧按钮） */
    setTintColor: (color: string) => void;
    /** 设置标题颜色 */
    setTitleColor: (color: string) => void;
    /**
     * 设置完全自定义的导航栏组件
     * 传入的组件会完全替换默认导航栏
     * @example
     * navBar.setCustomHeader(
     *   <MyCustomHeader
     *     title={pageTitle}
     *     onSave={handleSave}
     *     count={selectedCount}
     *   />
     * );
     */
    setCustomHeader: (component: ReactNode) => void;
    /**
     * 清除自定义导航栏，恢复默认导航栏
     */
    clearCustomHeader: () => void;
  };
}

/**
 * withNavigationBar 配置选项
 */
export interface IWithNavigationBarOptions extends Partial<INavigationBarProps> {
  /** 是否默认显示导航栏 */
  defaultVisible?: boolean;
}

/**
 * withNavigationBar 高阶组件
 * 自动为页面添加自定义导航栏，并注入控制方法
 *
 * @example
 * // 基础用法
 * export default withNavigationBar(MyPage, { title: '我的页面' });
 *
 * // 使用完全自定义的导航栏
 * const MyPage: React.FC<IWithNavigationBarProps> = ({ navBar }) => {
 *   const [count, setCount] = useState(0);
 *
 *   const handleSave = () => {
 *     console.log('保存', count);
 *   };
 *
 *   useEffect(() => {
 *     // 传入自定义导航栏组件，可以使用页面的数据和方法
 *     navBar.setCustomHeader(
 *       <View style={styles.customHeader}>
 *         <Text>已选择 {count} 项</Text>
 *         <TouchableOpacity onPress={handleSave}>
 *           <Text>保存</Text>
 *         </TouchableOpacity>
 *       </View>
 *     );
 *   }, [count]); // 当 count 变化时更新导航栏
 *
 *   return <View>...</View>;
 * };
 */
export function withNavigationBar<P extends object>(
  WrappedComponent: ComponentType<P & IWithNavigationBarProps>,
  defaultOptions?: IWithNavigationBarOptions,
): React.FC<P> {
  const WithNavigationBarComponent: React.FC<P> = (props) => {
    const [navBarOptions, setNavBarOptions] = React.useState<Partial<INavigationBarProps>>(
      defaultOptions ?? {},
    );
    const [isVisible, setIsVisible] = React.useState(defaultOptions?.defaultVisible ?? true);
    const [customHeader, setCustomHeader] = React.useState<ReactNode>(null);

    // 导航栏控制对象
    const navBar = React.useMemo(
      () => ({
        // 更新导航栏配置
        update: (options: Partial<INavigationBarProps>) => {
          setNavBarOptions((prev) => ({ ...prev, ...options }));
        },

        // 设置标题
        setTitle: (title: string) => {
          setNavBarOptions((prev) => ({ ...prev, title }));
        },

        // 设置右侧按钮
        setRightButtons: (rightButtons: INavBarButton[]) => {
          setNavBarOptions((prev) => ({ ...prev, rightButtons }));
        },

        // 设置右侧组件
        setRightComponent: (rightComponent: ReactNode) => {
          setNavBarOptions((prev) => ({ ...prev, rightComponent }));
        },

        // 设置是否显示返回按钮
        setShowBack: (showBack: boolean) => {
          setNavBarOptions((prev) => ({ ...prev, showBack }));
        },

        // 设置返回按钮点击回调
        setOnBack: (onBack: (() => void) | undefined) => {
          setNavBarOptions((prev) => ({ ...prev, onBack }));
        },

        // 设置返回按钮图标配置
        setBackIcon: (config: IBackIconConfig) => {
          setNavBarOptions((prev) => ({
            ...prev,
            backIcon: config.icon,
            tintColor: config.color ?? prev.tintColor,
          }));
        },

        // 设置导航栏可见性
        setVisible: (visible: boolean) => {
          setIsVisible(visible);
        },

        // 设置背景颜色
        setBackgroundColor: (backgroundColor: string) => {
          setNavBarOptions((prev) => ({ ...prev, backgroundColor }));
        },

        // 设置是否透明
        setTransparent: (transparent: boolean) => {
          setNavBarOptions((prev) => ({ ...prev, transparent }));
        },

        // 设置是否显示底部边框
        setShowBorder: (showBorder: boolean) => {
          setNavBarOptions((prev) => ({ ...prev, showBorder }));
        },

        // 设置图标颜色
        setTintColor: (tintColor: string) => {
          setNavBarOptions((prev) => ({ ...prev, tintColor }));
        },

        // 设置标题颜色
        setTitleColor: (titleColor: string) => {
          setNavBarOptions((prev) => ({ ...prev, titleColor }));
        },

        // 设置完全自定义的导航栏组件
        setCustomHeader: (component: ReactNode) => {
          setCustomHeader(component);
        },

        // 清除自定义导航栏
        clearCustomHeader: () => {
          setCustomHeader(null);
        },
      }),
      [],
    );

    // 渲染导航栏
    const renderHeader = (): ReactNode => {
      if (!isVisible) {
        return null;
      }

      // 如果有自定义导航栏，直接渲染
      if (customHeader) {
        return customHeader;
      }

      // 否则渲染默认导航栏
      return <NavigationBar {...navBarOptions} />;
    };

    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.content}>
          <WrappedComponent {...props} navBar={navBar} />
        </View>
      </View>
    );
  };

  WithNavigationBarComponent.displayName = `withNavigationBar(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithNavigationBarComponent;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
