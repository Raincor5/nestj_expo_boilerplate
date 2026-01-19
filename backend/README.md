# Backend - NestJS Authentication API

## Quick Start

1. Install dependencies: `npm install`
2. Create `.env` file (see `.env.example`)
3. Create PostgreSQL database: `CREATE DATABASE auth_db;`
4. Run: `npm run start:dev`

**Note**: The `dist` folder (compiled JavaScript) is in `.gitignore` and will be created automatically when you run `npm run build` or `npm run start:dev`. This is expected - you don't commit compiled code to git.

## Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data Transfer Objects
│   ├── guards/       # JWT authentication guard
│   ├── strategies/   # Passport JWT strategy
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/             # User module
│   ├── entities/     # User entity
│   ├── user.service.ts
│   └── user.module.ts
├── database/         # Database migrations & RLS
│   └── migrations/   # SQL migrations
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## Environment Variables

Required environment variables (see `.env.example`):

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_EXPIRES_IN` - Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 7d)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Database Setup

### Development

TypeORM's `synchronize: true` will automatically create tables. RLS policies are optional in development but recommended.

### Production

1. Set `synchronize: false` in `app.module.ts`
2. Run migrations: `npm run migration:run`
3. Apply RLS policies: `psql -U postgres -d auth_db -f src/database/migrations/001-setup-rls.sql`

## API Documentation

See main README.md for endpoint documentation.

## Security

- Passwords hashed with bcrypt (12 rounds)
- Refresh tokens hashed before database storage
- JWT rotation on each refresh
- Row-Level Security (RLS) policies
- Input validation with class-validator
- CORS enabled for development

## Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
