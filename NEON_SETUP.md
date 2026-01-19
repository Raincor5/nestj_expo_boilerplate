# Get Started with Neon

This guide walks you through setting up your NestJS backend with [Neon](https://neon.tech), a serverless PostgreSQL database.

## What is Neon?

Neon is a **serverless PostgreSQL database** platform that:
- ✅ Requires no server management
- ✅ Scales automatically with your app
- ✅ Has a free tier perfect for development
- ✅ Supports SSL connections out of the box
- ✅ Provides connection pooling for better performance

## Step 1: Create a Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Click **Sign Up** and create an account
3. Verify your email address
4. You'll be taken to your Neon dashboard

## Step 2: Create a Project

1. In the Neon dashboard, click **Create a project** or **New project**
2. Give it a name (e.g., `auth-app` or `nest-expo-boilerplate`)
3. Choose your region (select the region closest to you or your deployment target)
4. Click **Create project**

Neon will automatically create:
- A PostgreSQL database called `neondb`
- A default user and password
- A connection string

## Step 3: Get Your Connection String

After your project is created:

1. You'll see a **Connection string** section
2. There are different connection strings for different use cases
3. **For Pooler (recommended for serverless apps)**: Use the "Pooler" tab
   - Click the dropdown that says **Pooler** (not direct connection)
   - Copy the entire connection string (it starts with `postgresql://`)

The connection string will look like:
```
postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Step 4: Update Your Backend .env File

1. In the `backend` folder, open or create your `.env` file:
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

2. Replace the database configuration with your Neon connection string:
   ```env
   # Neon Database Configuration
   DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   DB_SSL=true
   
   # Keep your JWT secrets
   JWT_SECRET=your_generated_secret_here
   JWT_REFRESH_SECRET=your_generated_refresh_secret_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

**Important**: Do NOT commit `.env` to git. It's already in `.gitignore`.

## Step 5: Run Database Migrations

If you have migrations set up, run them to create your tables:

```bash
cd backend
npm run migration:run
```

## Step 6: Start Your Backend

```bash
npm run start:dev
```

You should see a message like:
```
Application is running on: http://localhost:3000
```

Your backend is now connected to Neon!

## Step 7: Test the Connection

Test your API endpoints using curl or a tool like Postman:

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Viewing Your Data in Neon

1. In the Neon dashboard, go to your project
2. Click **SQL Editor** in the left sidebar
3. Write SQL queries to view your tables:
   ```sql
   SELECT * FROM "user";
   ```

## Connection String Format Reference

Your backend (`app.module.ts`) already supports both formats:

### Option 1: DATABASE_URL (Recommended)
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### Option 2: Individual Environment Variables
```env
DB_HOST=ep-xxxxx.us-east-1.aws.neon.tech
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=neondb
DB_SSL=true
```

The backend will automatically use `DATABASE_URL` if it's set, otherwise it falls back to individual variables.

## Troubleshooting

### "FATAL: sorry, too many clients already connected"
**Solution**: Make sure to use the **Pooler** connection string, not the direct connection.

### "SSL certificate problem"
**Solution**: The connection string should include `?sslmode=require`. This is already configured in `app.module.ts`.

### "Connection refused"
**Solution**: 
1. Verify you copied the entire connection string correctly
2. Check that your IP is allowed (Neon allows all IPs by default)
3. Restart your backend with `npm run start:dev`

### "ENOTFOUND: getaddrinfo ENOTFOUND ep-xxxxx..."
**Solution**: Check your internet connection and ensure the endpoint URL is correct.

## Security Best Practices

1. **Never commit .env files** to git
2. **Use environment variables in production** - don't hardcode secrets
3. **Use different credentials** for development and production
4. **Rotate passwords** regularly in production
5. **Use Neon's project collaboration features** to manage team access securely

## Next Steps

### 1. Set Up Production Database
When ready to deploy:
1. Create a separate Neon project for production
2. Update production `.env` with the production connection string
3. Ensure migrations run before deploying

### 2. Configure Expo Frontend
Update `frontend/src/config/constants.ts` to point to your deployed backend:
```typescript
export const API_URL = 'https://your-backend-url.com';
```

### 3. Deploy Your Backend
Popular options:
- **Railway**: Railway.app - integrates with Neon
- **Render**: Render.com - free tier available
- **Vercel**: Vercel.com - for serverless deployments
- **Heroku**: Heroku.com - simple deployment

### 4. Monitor Your Database
Neon provides monitoring tools:
- Query performance insights
- Connection monitoring
- Storage usage tracking

Check the Neon dashboard regularly to monitor your database health.

## Useful Neon Resources

- [Neon Documentation](https://neon.tech/docs)
- [Connection Pooling Guide](https://neon.tech/docs/use-cases/serverless)
- [Prisma + Neon Guide](https://neon.tech/docs/guides/prisma)
- [Neon CLI](https://neon.tech/docs/reference/neon-cli)

## Questions?

If you encounter issues:
1. Check the [Neon Documentation](https://neon.tech/docs)
2. Review the troubleshooting section above
3. Check your `backend/.env` file configuration
4. Ensure migrations have run: `npm run migration:run`
