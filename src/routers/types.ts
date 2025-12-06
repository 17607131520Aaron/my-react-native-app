/**
 * 路由类型定义
 * 统一管理所有路由的名称和参数类型
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

// ==================== Engineer 模块路由 ====================
export interface IEngineerStackParamList {
  EngineerHome: undefined; // 工程师首页
  EngineerTaskList: { status?: 'pending' | 'completed' }; // 任务列表
  EngineerTaskDetail: { taskId: string }; // 任务详情
  EngineerProfile: undefined; // 个人资料
}

// ==================== Institution 模块路由 ====================
export interface IInstitutionStackParamList {
  InstitutionHome: undefined; // 机构首页
  InstitutionList: { filter?: string }; // 机构列表
  InstitutionDetail: { institutionId: string }; // 机构详情
  InstitutionSettings: undefined; // 机构设置
  ScanInboundPage: { scanType?: 'inbound' | 'outbound' }; // 扫码入库页面
}

// ==================== Mine 模块路由 ====================
export interface IMineStackParamList {
  MineHome: undefined; // 我的首页
  MineProfile: undefined; // 个人资料
  MineSettings: undefined; // 设置
  About: undefined; // 关于
  Login: undefined; // 登录（如果需要）
}

// ==================== 所有路由参数（扁平化） ====================
/**
 * 将所有模块的路由合并为一个扁平化的路由参数列表
 * 支持直接根据路由名称跳转，无需指定模块
 */
export interface IAllRoutesParamList
  extends IEngineerStackParamList,
    IInstitutionStackParamList,
    IMineStackParamList {}

// ==================== 根路由参数 ====================
export interface IRootStackParamList {
  Engineer: NavigatorScreenParams<IEngineerStackParamList>;
  Institution: NavigatorScreenParams<IInstitutionStackParamList>;
  Mine: NavigatorScreenParams<IMineStackParamList>;
  // 公共页面可以直接在根路由中定义
  Login: undefined;
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
export type InstitutionStackParamList = IInstitutionStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type MineStackParamList = IMineStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RootStackParamList = IRootStackParamList;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type RouteName = TRouteName;
