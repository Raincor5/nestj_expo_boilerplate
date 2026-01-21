import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../config/constants';

interface TestGroup {
  testId: string;
  testName: string;
  groupId: string;
  groupName: string;
  assignedAt: string;
}

export const storage = {
  async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setTestGroup(testGroup: TestGroup): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.TEST_GROUP, JSON.stringify(testGroup));
  },

  async getTestGroup(): Promise<TestGroup | null> {
    const data = await SecureStore.getItemAsync(STORAGE_KEYS.TEST_GROUP);
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
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TEST_GROUP);
  },
};
