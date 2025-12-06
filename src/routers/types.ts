/**
 * 路由类型定义
 * 统一管理所有路由的名称和参数类型
 */

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

// ==================== 路由配置接口 ====================
/**
 * 统一的路由配置项接口
 */
export interface IRouteConfig {
  name: keyof IAllRoutesParamList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
  /** 是否为 Tab 首页（不注册到 Root Stack） */
  isTabHome?: boolean;
}

/**
 * 模块路由配置接口
 */
export interface IModuleRoutes {
  /** 模块名称 */
  moduleName: string;
  /** 该模块的所有路由 */
  routes: IRouteConfig[];
  /** 模块默认导航选项 */
  defaultOptions?: NativeStackNavigationOptions;
}

// ==================== Engineer 模块路由 ====================
export interface IEngineerStackParamList {
  EngineerHome: undefined; // 工程师首页
  EngineerTaskList: { status?: 'pending' | 'completed' }; // 任务列表
  EngineerTaskDetail: { taskId: string }; // 任务详情
  EngineerProfile: undefined; // 个人资料
  [key: string]: object | undefined;
}

// ==================== Institution 模块路由 ====================
export interface IInstitutionStackParamList {
  InstitutionHome: undefined; // 机构首页
  InstitutionList: { filter?: string }; // 机构列表
  InstitutionDetail: { institutionId: string }; // 机构详情
  InstitutionSettings: undefined; // 机构设置
  ScanInboundPage: { scanType?: 'inbound' | 'outbound' }; // 扫码入库页面
  [key: string]: object | undefined;
}

// 向后兼容别名
// eslint-disable-next-line @typescript-eslint/naming-convention
export type InstitutionStackParamList = IInstitutionStackParamList;

// ==================== Mine 模块路由 ====================
export interface IMineStackParamList {
  MineHome: undefined; // 我的首页
  MineProfile: undefined; // 个人资料
  MineSettings: undefined; // 设置
  About: undefined; // 关于
  Login: undefined; // 登录（如果需要）
  [key: string]: object | undefined;
}

// ==================== 所有路由参数（扁平化） ====================
/**
 * 将所有模块的路由合并为一个扁平化的路由参数列表
 * 支持直接根据路由名称跳转，无需指定模块
 */
export type IAllRoutesParamList = IEngineerStackParamList &
  IInstitutionStackParamList &
  IMineStackParamList;

// ==================== 根路由参数 ====================
/**
 * Root Stack 参数列表
 * 包含 MainTabs 和所有页面（扁平化结构，支持跨模块导航）
 */
export interface IRootStackParamList {
  // MainTabs 作为 Root Stack 的一个 Screen
  MainTabs: undefined;

  // Engineer 模块页面
  EngineerHome: undefined;
  EngineerTaskList: { status?: 'pending' | 'completed' };
  EngineerTaskDetail: { taskId: string };
  EngineerProfile: undefined;

  // Institution 模块页面
  InstitutionHome: undefined;
  InstitutionList: { filter?: string };
  InstitutionDetail: { institutionId: string };
  InstitutionSettings: undefined;
  ScanInboundPage: { scanType?: 'inbound' | 'outbound' };

  // Mine 模块页面
  MineHome: undefined;
  MineProfile: undefined;
  MineSettings: undefined;
  About: undefined;
  Login: undefined;

  [key: string]: object | undefined;
}

// ==================== 底部 Tab 导航参数 ====================
/**
 * MainTab 参数列表
 * Tab Navigator 仅用于切换首页，不包含嵌套 Stack 参数
 */
export interface IMainTabParamList {
  EngineerTab: undefined;
  InstitutionTab: undefined;
  MineTab: undefined;
  [key: string]: object | undefined;
}

/** 工程师角色的底部 Tab（向后兼容） */
export interface IEngineerTabParamList {
  EngineerTab: undefined;
  MineTab: undefined;
  [key: string]: object | undefined;
}

/** 机构角色的底部 Tab（向后兼容） */
export interface IInstitutionTabParamList {
  InstitutionTab: undefined;
  MineTab: undefined;
  [key: string]: object | undefined;
}

/** 管理员角色的底部 Tab（向后兼容） */
export interface IAdminTabParamList {
  EngineerTab: undefined;
  InstitutionTab: undefined;
  MineTab: undefined;
  [key: string]: object | undefined;
}

// ==================== 路由名称常量 ====================
export const ROUTE_NAMES = {
  // 模块路由
  ENGINEER: 'Engineer',
  INSTITUTION: 'Institution',
  MINE: 'Mine',

  // Engineer 模块页面
  ENGINEER_HOME: 'EngineerHome',
  ENGINEER_TASK_LIST: 'EngineerTaskList',
  ENGINEER_TASK_DETAIL: 'EngineerTaskDetail',
  ENGINEER_PROFILE: 'EngineerProfile',

  // Institution 模块页面
  INSTITUTION_HOME: 'InstitutionHome',
  INSTITUTION_LIST: 'InstitutionList',
  INSTITUTION_DETAIL: 'InstitutionDetail',
  INSTITUTION_SETTINGS: 'InstitutionSettings',
  SCAN_INBOUND_PAGE: 'ScanInboundPage',

  // Mine 模块页面
  MINE_HOME: 'MineHome',
  MINE_PROFILE: 'MineProfile',
  MINE_SETTINGS: 'MineSettings',
  ABOUT: 'About',
  LOGIN: 'Login',
} as const;

// 导出路由名称类型
export type TRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

// ==================== 兼容性别名（向后兼容） ====================
/**
 * 为了保持向后兼容，导出不带 I 前缀的别名
 * 建议新代码使用带 I 前缀的类型
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type AllRoutesParamList = IAllRoutesParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type EngineerStackParamList = IEngineerStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type MineStackParamList = IMineStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RootStackParamList = IRootStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RouteName = TRouteName;
