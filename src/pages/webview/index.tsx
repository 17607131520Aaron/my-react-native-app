/**
 * WebView 页面
 */

import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/router/types';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

function WebViewPage({ route }: Props) {
  const { url } = route.params;

  const renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  return (
    <WebView
      source={{ uri: url }}
      style={styles.container}
      startInLoadingState
      renderLoading={renderLoading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WebViewPage;
