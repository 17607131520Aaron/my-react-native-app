/**
 * TypeScript 类型定义
 * 统一管理应用中的类型和接口
 */

// 示例：用户信息类型
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;

}

// 示例：API 响应类型
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 示例：导航参数类型
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

