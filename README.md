# NestJS + Expo Authentication Boilerplate

A full-stack authentication system with JWT rotation, row-level security, and secure token storage.

## Stack

- **Frontend**: React Native (Expo)
- **Backend**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Authentication**: JWT with access/refresh token rotation
- **Security**: bcrypt hashing, SecureStore for token storage

## Features

✅ JWT token rotation (access + refresh tokens)  
✅ Row-Level Security (RLS) policies for PostgreSQL  
✅ Secure password hashing with bcrypt (12 rounds)  
✅ Secure token storage using Expo SecureStore  
✅ Automatic token refresh on 401 errors  
✅ Input validation with class-validator  
✅ CORS enabled for development  

## Project Structure

```
.
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── user/     # User module
│   │   └── database/ # Database migrations & RLS
│   └── package.json
├── frontend/         # Expo React Native app
│   ├── src/
│   │   ├── screens/  # Login, Register, Home
│   │   ├── services/ # API services
│   │   ├── context/  # Auth context
│   │   └── utils/    # Storage utilities
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (local installation)
- Expo CLI (for frontend): `npm install -g expo-cli`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE auth_db;
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=auth_db
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   PORT=3000
   NODE_ENV=development
   ```

5. **Apply RLS policies (optional for development):**
   ```bash
   psql -U postgres -d auth_db -f src/database/migrations/001-setup-rls.sql
   ```
   Note: For development, TypeORM's `synchronize: true` will create tables automatically.

6. **Start the backend:**
   ```bash
   npm run start:dev
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL (if needed):**
   Edit `src/config/constants.ts` if your backend runs on a different URL or IP:
   ```typescript
   export const API_BASE_URL = __DEV__
     ? 'http://YOUR_LOCAL_IP:3000'  // Replace with your local IP for physical devices
     : 'https://your-production-api.com';
   ```

4. **Start Expo:**
   ```bash
   npm start
   ```

   Then press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login with credentials
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/refresh` - Refresh access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

- `GET /auth/me` - Get current user (requires auth)
  ```
  Headers: Authorization: Bearer <access-token>
  ```

- `POST /auth/logout` - Logout (requires auth)
  ```
  Headers: Authorization: Bearer <access-token>
  ```

## Security Features

### JWT Rotation

- **Access tokens**: Short-lived (15 minutes default), included in every request
- **Refresh tokens**: Long-lived (7 days default), stored securely, hashed in database
- **Rotation**: New token pair generated on each refresh for better security

### Row-Level Security (RLS)

PostgreSQL RLS policies ensure:
- Users can only view their own data
- Users cannot update sensitive fields (password_hash, refresh_token_hash) directly
- Application layer enforces additional security checks

### Password Security

- bcrypt hashing with 12 salt rounds
- Minimum 8 character password requirement
- Passwords never stored in plain text

### Token Storage

- Frontend uses Expo SecureStore (encrypted storage)
- Refresh tokens hashed before database storage
- Automatic token refresh on expiration

## Development Notes

1. **Database Synchronization**: In development, TypeORM's `synchronize: true` creates tables automatically. For production, set `synchronize: false` and use migrations.

2. **CORS**: Backend has CORS enabled for development. Adjust for production.

3. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.

4. **RLS in Development**: RLS policies can be applied manually via SQL. For development, the application layer handles security checks.

## Production Considerations

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Enable HTTPS
4. Set `synchronize: false` in TypeORM config
5. Use database migrations
6. Apply RLS policies manually
7. Configure proper CORS origins
8. Use environment-specific API URLs
9. Enable rate limiting
10. Set up proper logging and monitoring

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Frontend can't connect to backend
- Verify backend is running on correct port
- For physical devices, use your local IP address instead of `localhost`
- Check CORS settings in `main.ts`

### Database connection errors
- Verify PostgreSQL service is running
- Check connection details in `.env`
- Ensure database user has proper permissions

## License

MIT
