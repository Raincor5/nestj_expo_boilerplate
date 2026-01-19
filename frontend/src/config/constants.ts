/**
 * Backend API URL Configuration
 * 
 * For local development (Citrix/Virtual Desktop + Expo Tunneling):
 * 1. Start backend: npm run start:dev
 * 2. Start Expo with tunneling: expo start --tunnel
 * 3. Scan QR code with Expo Go app
 * 4. The tunneling URL will automatically route through Expo tunnel
 * 
 * Options:
 * - 'http://localhost:3000' - Only works with LAN/physical device on same network
 * - Use tunneling URL for Citrix/restricted networks (auto-detected with Expo tunnel)
 */

// Automatically detect the API URL based on environment
export const API_BASE_URL = __DEV__
  ? process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
  : 'https://your-production-api.com';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};
