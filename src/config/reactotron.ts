import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'MyReactNativeApp',
    host: 'localhost', // adb reverse 已设置，使用 localhost
    port: 9090,
  })
  .useReactNative({
    asyncStorage: true, // 追踪 AsyncStorage
    networking: {
      // 网络请求监控
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: () => false }, // 错误追踪
    overlay: false,
  })
  .connect();

export default reactotron;
