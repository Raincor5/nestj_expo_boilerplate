# Quick Setup Guide

Follow these steps to get the authentication system up and running.

## 1. PostgreSQL Setup

Install PostgreSQL if you haven't already, then create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auth_db;

# Exit
\q
```

## 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Note: The 'dist' folder will be created automatically when you run build/start commands
# It's in .gitignore because it's compiled code (generated from TypeScript source)

# Create .env file (copy from .env.example and edit)
# Windows: copy .env.example .env
# Linux/Mac: cp .env.example .env

# Edit .env with your database credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=auth_db
# 
# Generate JWT secrets using one of these commands:
#   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
#   openssl rand -hex 64
# Run it TWICE to get two different secrets for JWT_SECRET and JWT_REFRESH_SECRET
# 
# JWT_SECRET=<paste-your-generated-secret-here>
# JWT_REFRESH_SECRET=<paste-your-second-generated-secret-here>

# Start backend
npm run start:dev
```

Backend should now be running on `http://localhost:3000`

## 3. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# For physical devices: Update API URL in src/config/constants.ts
# Replace 'localhost' with your computer's IP address

# Start Expo
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go app on your phone

## 4. Testing

1. **Register**: Create a new account with email and password
2. **Login**: Use your credentials to log in
3. **Home**: You should see your user info
4. **Logout**: Test logout functionality

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready` (Linux/Mac) or check Services (Windows)
- Verify database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Frontend can't connect
- For physical devices: Use your local IP instead of `localhost` in `src/config/constants.ts`
- Find your IP:
  - **Windows**: `ipconfig` → IPv4 Address
  - **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Ensure backend is running and accessible

### Port already in use
- Change `PORT` in backend `.env` file
- Update frontend `API_BASE_URL` accordingly

## What's Implemented

✅ User registration and login  
✅ JWT access and refresh tokens  
✅ Token rotation on refresh  
✅ Secure password hashing (bcrypt, 12 rounds)  
✅ Secure token storage (Expo SecureStore)  
✅ Automatic token refresh  
✅ Row-Level Security setup (enabled, app-layer enforced)  
✅ Input validation  
✅ CORS for development  

## Next Steps

- Customize UI/UX
- Add email verification (omitted per requirements)
- Add password reset functionality
- Add profile management
- Deploy to production
