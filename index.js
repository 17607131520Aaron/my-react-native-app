/**
 * @format
 */

// Reactotron 必须在其他导入之前初始化
if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./src/config/reactotron');
}

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/app';

AppRegistry.registerComponent(appName, () => App);
