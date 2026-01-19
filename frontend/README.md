# Frontend - Expo React Native App

## Quick Start

1. Install dependencies: `npm install`
2. Update API URL in `src/config/constants.ts` if needed
3. Run: `npm start`
4. Press `i` for iOS or `a` for Android

## Project Structure

```
src/
├── screens/          # Screen components
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── HomeScreen.tsx
├── services/         # API services
│   ├── api.ts       # Axios instance with interceptors
│   └── authService.ts
├── context/         # React context
│   └── AuthContext.tsx
├── utils/           # Utilities
│   └── storage.ts   # SecureStore wrapper
└── config/          # Configuration
    └── constants.ts # API URLs, storage keys
```

## Features

- Secure token storage with Expo SecureStore
- Automatic token refresh on 401 errors
- JWT token rotation support
- React Navigation for routing
- TypeScript for type safety

## Configuration

### API URL

Edit `src/config/constants.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'        // Emulator/simulator
  : 'http://YOUR_IP:3000';         // Physical device (use local IP)
```

For physical devices, use your computer's local IP address instead of `localhost`.

### Find Your Local IP

- **macOS/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig` (look for IPv4 Address)

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web (not fully supported)

## Security

- Tokens stored in Expo SecureStore (encrypted storage)
- Automatic token refresh before expiration
- Secure HTTP headers
- No tokens in localStorage or AsyncStorage

## Troubleshooting

### Can't connect to backend
- Verify backend is running
- For physical devices, use local IP, not `localhost`
- Check firewall settings

### Build errors
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall

### Metro bundler issues
- Reset cache: `npm start -- --reset-cache`
