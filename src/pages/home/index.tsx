/**
 * 首页
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/router/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

function Home({ navigation }: Props) {
  const handleOpenWebView = () => {
    navigation.navigate('WebView', {
      url: 'https://reactnative.dev',
      title: 'React Native',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>欢迎使用 React Native</Text>
      <TouchableOpacity style={styles.button} onPress={handleOpenWebView}>
        <Text style={styles.buttonText}>打开 WebView</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;
