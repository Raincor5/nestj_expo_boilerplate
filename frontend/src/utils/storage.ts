import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../config/constants';

interface TestGroup {
  testId: string;
  testName: string;
  groupId: string;
  groupName: string;
  assignedAt: string;
}

/**
 * Secure storage helper that falls back to localStorage on web,
 * since expo-secure-store native APIs are unavailable in web builds.
 */
const storageAdapter = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async deleteItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const storage = {
  async setAccessToken(token: string): Promise<void> {
    await storageAdapter.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await storageAdapter.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await storageAdapter.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await storageAdapter.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setTestGroup(testGroup: TestGroup): Promise<void> {
    await storageAdapter.setItem(
      STORAGE_KEYS.TEST_GROUP,
      JSON.stringify(testGroup),
    );
  },

  async getTestGroup(): Promise<TestGroup | null> {
    const data = await storageAdapter.getItem(STORAGE_KEYS.TEST_GROUP);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Failed to parse test group from storage:', error);
        return null;
      }
    }
    return null;
  },

  async clearTokens(): Promise<void> {
    await storageAdapter.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
    await storageAdapter.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
    await storageAdapter.deleteItem(STORAGE_KEYS.TEST_GROUP);
  },
};
