/**
 * 路由配置汇总
 * 统一管理所有模块的路由配置
 */

// ==================== 导出各模块路由配置 ====================
export { engineerDefaultOptions, engineerRoutes } from './engineer';
export { institutionDefaultOptions, institutionRoutes } from './institution';
export { mineDefaultOptions, mineRoutes } from './mine';

// ==================== 导出类型 ====================
export type {
  AllRoutesParamList,
  EngineerStackParamList,
  IAllRoutesParamList,
  IEngineerStackParamList,
  IInstitutionStackParamList,
  IMineStackParamList,
  InstitutionStackParamList,
  IRootStackParamList,
  MineStackParamList,
  RootStackParamList,
  TRouteName,
} from './types';

export { ROUTE_NAMES } from './types';
