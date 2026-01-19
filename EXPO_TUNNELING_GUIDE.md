# Expo Tunneling Setup Guide

This guide explains how to use **Expo tunneling** to expose your frontend on your phone from a **Citrix Virtual Desktop** environment.

## Why Tunneling?

When using Citrix Virtual Desktop or university networks:
- ❌ You can't use `localhost` from your phone
- ❌ Network restrictions may block direct IP connections
- ✅ Expo tunneling creates a secure tunnel through Expo's servers
- ✅ Works on any network without firewall issues

## Prerequisites

1. **Backend running**: `npm run start:dev` (on Citrix machine)
2. **Expo CLI installed**: `npm install -g expo-cli`
3. **Expo account**: Create one at [expo.dev](https://expo.dev)
4. **Expo Go app**: Download on your phone (iOS/Android app store)

## Step-by-Step Setup

### 1. Make Sure Backend is Running

On your Citrix Virtual Desktop terminal:

```bash
cd backend
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
```

### 2. Start Expo with Tunneling

In a NEW terminal in the frontend folder:

```bash
cd frontend
expo start --tunnel
```

This will:
- Prompt you to log in to your Expo account (first time only)
- Create a tunnel to expose your Expo app
- Display a QR code

### 3. Scan the QR Code

On your phone:
1. Open **Expo Go** app
2. Tap the **QR code scanner** icon
3. Point your phone camera at the QR code in the terminal
4. Wait for the app to load

Your app will now connect through the Expo tunnel!

## Expected Output

When you run `expo start --tunnel`, you'll see something like:

```
Starting Expo Go...
Starting Metro Bundler
 ✓ Expo Go is running
 ✓ Expo tunnel is active

To open the app:
  Scan the QR code above

  › Web: http://localhost:19000
  › Tunnel: exp://xxxx-xxxx-xxxx.us.ngrok.io
```

The **Tunnel URL** is what your phone connects to.

## Backend API Communication

### How It Works

```
Phone (Expo Go)
    ↓
Expo Tunnel (encrypted)
    ↓
Citrix Virtual Desktop (localhost:3000)
```

1. Your phone connects to the Expo tunnel via QR code
2. The tunnel is created on your Citrix machine
3. API calls from your phone are routed through the tunnel to `http://localhost:3000`
4. Responses come back through the tunnel to your phone

### API URL Configuration

The frontend constants automatically use:
```typescript
API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
```

**No changes needed** - the tunneling happens transparently!

## Testing the Connection

### 1. Test Backend is Running

Open a browser and visit:
```
http://localhost:3000
```

You should see the NestJS welcome page or a response.

### 2. Test from Your Phone

In your Expo Go app:
1. Tap **My projects** or find your running app
2. Try to **Register** with test credentials
3. If successful, your backend is receiving requests!

### Troubleshooting API Calls

If API calls fail, check:

1. **Backend still running?**
   ```bash
   # Check if port 3000 is listening
   netstat -tuln | grep 3000  # Linux/Mac
   netstat -ano | findstr :3000  # Windows
   ```

2. **Expo tunnel still active?**
   - Look for the tunnel URL in your terminal
   - If it says "Tunnel connection lost", restart Expo

3. **CORS enabled?**
   - Your backend has CORS enabled in `main.ts`
   - Should automatically work

## Alternative: LAN Mode (If on Same Network)

If your Citrix machine is on the same network as your physical device (unlikely but possible):

```bash
expo start --lan
```

Then manually enter your machine's IP address.

Find your IP:
```bash
# Windows
ipconfig  # Look for IPv4 Address

# Linux/Mac
ifconfig | grep "inet "
```

## Advanced: Environment Variables

If you want to override the API URL:

1. Create `.env.local` in frontend folder:
   ```
   EXPO_PUBLIC_API_URL=http://your-custom-url:3000
   ```

2. Restart Expo:
   ```bash
   expo start --tunnel
   ```

## Important Notes

### Security

- ✅ Tunneling is encrypted end-to-end
- ✅ Only you can connect to your tunnel (requires Expo account)
- ✅ Safe for development (never use for production data)
- ⚠️ Keep your Expo credentials safe

### Limitations

- **Speed**: Slightly slower than LAN due to tunneling overhead
- **Reliability**: Depends on internet connection to Expo servers
- **Development only**: Not suitable for production

### Best Practices

1. **Keep Expo logged in**: Easier to reconnect
2. **Close unnecessary apps**: Reduces data usage
3. **Use VPN carefully**: Some VPNs conflict with tunneling
4. **Check connection**: Restart tunnel if getting errors

## Common Issues

### "Tunnel connection lost"
- **Cause**: Internet connection interrupted
- **Fix**: Restart `expo start --tunnel`

### "Cannot connect to server"
- **Cause**: Backend not running
- **Fix**: Check `npm run start:dev` is still running

### "QR code not scanning"
- **Cause**: Poor lighting or distance
- **Fix**: Move closer, increase brightness, or use tunnel URL directly

### "API requests timing out"
- **Cause**: Network congestion or backend issue
- **Fix**: Check backend logs, might be a NestJS error

### "Login/Register fails but no error"
- **Cause**: Backend error response not shown
- **Fix**: Check backend terminal for error logs

## Switching Back to Local Development

When you're back in the office or can use `localhost`:

```bash
expo start --lan
# or
expo start  # Opens menu to choose
```

Then update constants if needed:
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://production-api.com';
```

## Useful Commands

```bash
# Start with tunneling
expo start --tunnel

# Start with LAN
expo start --lan

# Interactive menu to choose connection type
expo start

# Show tunnel status
expo publish

# Clear cache (if issues)
expo start --tunnel --clear
```

## Production Deployment

When ready to deploy:

1. **Deploy backend** to a cloud service (Railway, Render, Vercel, etc.)
2. **Update frontend constants**:
   ```typescript
   export const API_BASE_URL = __DEV__
     ? process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
     : 'https://your-deployed-backend.com';
   ```
3. **Build and submit** to app stores

## Resources

- [Expo Tunneling Docs](https://docs.expo.dev/guides/publishing/)
- [Expo Go App](https://docs.expo.dev/get-started/expo-go/)
- [Environment Variables in Expo](https://docs.expo.dev/build-reference/variables/)

## Quick Reference

```bash
# Terminal 1: Run backend
cd backend
npm run start:dev

# Terminal 2: Run Expo with tunneling
cd frontend
expo start --tunnel

# Phone: Scan QR code with Expo Go app
```

That's it! 🚀
