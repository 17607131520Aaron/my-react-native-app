# 路由系统使用指南

## 架构设计

本路由系统采用扁平化设计，将所有模块的路由合并到一起，支持直接根据路由名称跳转，无需指定模块名。

### 核心特性

1. **扁平化路由配置**：所有模块的路由合并到 `allRoutes` 数组中
2. **直接路由跳转**：根据路由名称直接跳转，自动判断所属模块
3. **类型安全**：完整的 TypeScript 类型支持
4. **跨模块跳转**：支持从任意模块跳转到其他模块的任意页面

## 文件结构

```
routers/
├── index.ts          # 路由配置汇总，合并所有模块路由
├── navigation.ts     # 路由导航工具函数
├── types.ts          # 路由类型定义
├── engineer.ts       # Engineer 模块路由配置
├── institution.ts    # Institution 模块路由配置
└── mine.ts           # Mine 模块路由配置
```

## 使用方法

### 1. 在模块内配置路由

每个模块在自己的文件中配置路由，例如 `mine.ts`：

```typescript
import AboutPage from '~/pages/About';
import LoginPage from '~/pages/Login';

export const mineRoutes: MineRouteConfig[] = [
  {
    name: 'About',
    component: AboutPage,
    options: {
      title: '关于',
      headerShown: true,
    },
  },
  {
    name: 'Login',
    component: LoginPage,
    options: {
      title: '登录',
      headerShown: true,
    },
  },
];
```

### 2. 在导航器中注册路由

在根导航器中，使用汇总的路由配置：

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { moduleConfigs } from '~/routers';

const RootStack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {/* Engineer 模块 */}
        <RootStack.Screen
          name="Engineer"
          component={EngineerNavigator}
          options={{ headerShown: false }}
        />

        {/* Institution 模块 */}
        <RootStack.Screen
          name="Institution"
          component={InstitutionNavigator}
          options={{ headerShown: false }}
        />

        {/* Mine 模块 */}
        <RootStack.Screen
          name="Mine"
          component={MineNavigator}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. 模块内导航（同模块跳转）

在模块内部，使用标准的 React Navigation 方式：

```typescript
import { useNavigation } from '@react-navigation/native';
import type { MineStackParamList } from '~/routers';

type NavigationProp = NavigationProp<MineStackParamList>;

function MineHomePage() {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigateToAbout = () => {
    navigation.navigate('About');
  };

  return (
    <Button onPress={handleNavigateToAbout} title="关于" />
  );
}
```

### 4. 跨模块导航（推荐方式）

**直接根据路由名称跳转，无需指定模块名！**

#### 方式一：使用 navigateTo 函数

```typescript
import { useNavigation } from '@react-navigation/native';
import { navigateTo, type RootNavigationProp } from '~/routers/navigation';

function SomePage() {
  const navigation = useNavigation<RootNavigationProp>();

  // 跳转到 Engineer 模块的 EngineerTaskDetail 页面
  const handleNavigateToTask = () => {
    navigateTo(navigation, 'EngineerTaskDetail', { taskId: '123' });
  };

  // 跳转到 Institution 模块的 ScanInboundPage 页面
  const handleNavigateToScan = () => {
    navigateTo(navigation, 'ScanInboundPage', { scanType: 'inbound' });
  };

  // 跳转到 Mine 模块的 About 页面
  const handleNavigateToAbout = () => {
    navigateTo(navigation, 'About');
  };

  return (
    <View>
      <Button onPress={handleNavigateToTask} title="查看任务" />
      <Button onPress={handleNavigateToScan} title="扫码入库" />
      <Button onPress={handleNavigateToAbout} title="关于" />
    </View>
  );
}
```

#### 方式二：使用 Hook 封装

```typescript
import { useNavigation } from '@react-navigation/native';
import { useNavigationHelper, type RootNavigationProp } from '~/routers/navigation';

function SomePage() {
  const navigation = useNavigation<RootNavigationProp>();
  const { navigateTo } = useNavigationHelper(navigation);

  // 使用封装的导航函数
  const handleNavigateToTask = () => {
    navigateTo('EngineerTaskDetail', { taskId: '123' });
  };

  const handleNavigateToScan = () => {
    navigateTo('ScanInboundPage', { scanType: 'inbound' });
  };

  const handleNavigateToAbout = () => {
    navigateTo('About');
  };

  return (
    <View>
      <Button onPress={handleNavigateToTask} title="查看任务" />
      <Button onPress={handleNavigateToScan} title="扫码入库" />
      <Button onPress={handleNavigateToAbout} title="关于" />
    </View>
  );
}
```

## 类型安全

所有路由跳转都支持完整的 TypeScript 类型检查：

- ✅ 路由名称自动补全
- ✅ 参数类型检查
- ✅ 跨模块跳转类型安全

```typescript
// ✅ 正确：参数类型匹配
navigateTo(navigation, 'EngineerTaskDetail', { taskId: '123' });

// ❌ 错误：参数类型不匹配
navigateTo(navigation, 'EngineerTaskDetail', { taskId: 123 }); // 类型错误

// ❌ 错误：路由名称不存在
navigateTo(navigation, 'NonExistentRoute', {}); // 类型错误
```

## 路由工具函数

### 查找路由配置

```typescript
import { findRouteConfig } from '~/routers';

const routeConfig = findRouteConfig('About');
if (routeConfig) {
  console.log(routeConfig.options?.title); // '关于'
}
```

### 获取所有路由

```typescript
import { allRoutes } from '~/routers';

console.log(allRoutes.length); // 所有路由的总数
```

### 获取模块路由列表

```typescript
import { getModuleRoutes } from '~/routers';

const mineRoutes = getModuleRoutes('Mine');
console.log(mineRoutes.length); // Mine 模块的路由数量
```

### 自动判断路由所属模块

```typescript
import { getRouteModule } from '~/routers';

const module = getRouteModule('About'); // 'Mine'
const module2 = getRouteModule('EngineerTaskDetail'); // 'Engineer'
```

## 最佳实践

1. **模块内跳转**：优先使用模块内的标准导航方式
2. **跨模块跳转**：使用 `navigateTo` 函数，直接根据路由名称跳转
3. **路由配置**：在各自的模块文件中维护路由配置
4. **类型定义**：在 `types.ts` 中统一管理路由参数类型

## 设计优势

1. **简洁直观**：直接根据路由名称跳转，无需关心模块归属
2. **类型安全**：完整的 TypeScript 类型支持
3. **自动判断**：系统自动判断路由所属模块，无需手动指定
4. **易于维护**：所有路由在 `index.ts` 中汇总，一目了然
