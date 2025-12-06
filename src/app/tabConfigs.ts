/**
 * 各角色的 Tab 配置
 */

import { EngineerHomeScreen, InstitutionHomeScreen, MineScreen } from '~/routers';

import type { ITabConfig } from './types';
import type { TUserRole } from '~/store';

// ==================== 单个 Tab 配置 ====================
// Tab 名称使用 Tab 后缀，避免与 Stack Screen 名称冲突
const ENGINEER_TAB: ITabConfig = {
  name: 'EngineerTab',
  label: '工作台',
  icon: '🔧',
  component: EngineerHomeScreen,
};

const INSTITUTION_TAB: ITabConfig = {
  name: 'InstitutionTab',
  label: '机构',
  icon: '🏢',
  component: InstitutionHomeScreen,
};

const MINE_TAB: ITabConfig = {
  name: 'MineTab',
  label: '我的',
  icon: '👤',
  component: MineScreen,
};

// ==================== 各角色的 Tab 配置 ====================
const ROLE_TABS: Record<TUserRole, ITabConfig[]> = {
  engineer: [ENGINEER_TAB, MINE_TAB],
  institution: [INSTITUTION_TAB, MINE_TAB],
  admin: [ENGINEER_TAB, INSTITUTION_TAB, MINE_TAB],
};

// 默认 Tab 配置（未登录或角色未知时）
const DEFAULT_TABS: ITabConfig[] = [INSTITUTION_TAB, MINE_TAB];

/**
 * 根据角色获取 Tab 配置
 */
export const getTabsByRole = (role: TUserRole | null): ITabConfig[] => {
  if (!role) return DEFAULT_TABS;
  return ROLE_TABS[role] ?? DEFAULT_TABS;
};
