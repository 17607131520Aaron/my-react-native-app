/**
 * 我的首页
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useUserStore } from '~/store';
import { useTheme } from '~/theme';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { IMineStackParamList } from '~/routers/types';

interface IProps {
  navigation: NativeStackNavigationProp<IMineStackParamList, 'MineHome'>;
}

const MineHomePage: React.FC<IProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { profile, isAuthenticated, logout } = useUserStore();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          {isAuthenticated ? profile?.name || '用户' : '未登录'}
        </Text>
      </View>

      <View style={styles.menuList}>
        {!isAuthenticated && (
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleLogin}
          >
            <Text style={[styles.menuText, { color: theme.colors.text }]}>🔐 登录</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
          onPress={handleAbout}
        >
          <Text style={[styles.menuText, { color: theme.colors.text }]}>ℹ️ 关于</Text>
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={handleLogout}
          >
            <Text style={[styles.menuText, { color: theme.colors.error }]}>🚪 退出登录</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatar: {
    fontSize: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
  },
});

export default MineHomePage;
