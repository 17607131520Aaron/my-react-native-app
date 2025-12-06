/**
 * 机构首页
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { navigateTo } from '~/routers/navigation';
import { useTheme } from '~/theme';

const InstitutionHomePage: React.FC = () => {
  const { theme } = useTheme();

  const handleScanInbound = (): void => {
    navigateTo('ScanInboundPage', {});
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>机构首页</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleScanInbound}
      >
        <Text style={[styles.buttonText, { color: theme.colors.background }]}>📦 扫码入库</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default InstitutionHomePage;
