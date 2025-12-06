/**
 * App 导航相关类型定义
 */

import type { ComponentType } from 'react';
import type { IMainTabParamList } from '~/routers/types';

/** Tab 配置项 */
export interface ITabConfig {
  name: keyof IMainTabParamList;
  label: string;
  icon: string;
  component: ComponentType;
  /** 对应的模块 key，用于查找首页组件 */
  moduleKey: 'engineer' | 'institution' | 'mine';
}

// Re-export IMainTabParamList for convenience
export type { IMainTabParamList } from '~/routers/types';
