# Docker Setup Guide

This guide explains how to run the NestJS backend in Docker locally and prepare it for Northflank deployment.

## Prerequisites

1. **Docker Desktop** installed ([download here](https://www.docker.com/products/docker-desktop))
2. **Docker Compose** (included with Docker Desktop)

## Local Development with Docker

### Option 1: Using Docker Compose (Easiest)

Includes PostgreSQL container + NestJS backend:

```bash
cd nestj_expo_boilerplate

# Start both Postgres and backend
docker-compose up

# Backend runs on http://localhost:3000
# Postgres runs on localhost:5432
```

**Stop it:**
```bash
docker-compose down
```

**Stop and remove volumes (clean state):**
```bash
docker-compose down -v
```

### Option 2: Manual Docker Build

Build the Docker image manually:

```bash
cd backend

# Build image
docker build -t nest-auth-api:latest .

# Run container (with local Postgres)
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=neondb \
  -e DB_SSL=false \
  -e JWT_SECRET=your_secret_here \
  -e JWT_REFRESH_SECRET=your_refresh_secret_here \
  -e NODE_ENV=development \
  nest-auth-api:latest
```

## Using Neon with Docker Locally

If your network allows port 5432 outbound, or you're using a VPN:

Edit `docker-compose.yml` and replace the `DB_*` environment variables with:

```yaml
environment:
  DATABASE_URL: postgresql://neondb_owner:PASSWORD@ep-nameless-rain-abgrhudx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
  DB_SSL: "true"
  JWT_SECRET: ${JWT_SECRET}
  JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
```

Then restart:
```bash
docker-compose up --build
```

## Testing the Container Locally

Once the backend is running:

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Northflank Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Add Docker configuration"
git push origin main
```

### 2. Create Northflank Service

1. Go to [northflank.com](https://northflank.com)
2. Click **New** → **Service** → **Docker**
3. Connect your GitHub repository
4. Select the branch (main)
5. Set build command (Northflank usually auto-detects):
   ```
   npm ci && npm run build
   ```
6. Set start command:
   ```
   node dist/main.js
   ```

### 3. Configure Environment Variables

In Northflank dashboard → Service → **Variables**:

```
DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-nameless-rain-abgrhudx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
DB_SSL=true
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

### 4. Set Port & Health Check

- **Port:** 3000
- **Health check:** `GET /` (or leave default)
- **Enable:** HTTP route (Northflank will give you a public URL)

### 5. Deploy


Click **Deploy** and wait for the service to start.

## Dockerfile Explanation

The `Dockerfile` uses a **multi-stage build**:

1. **Builder stage**: Compiles TypeScript to JavaScript
2. **Production stage**: Runs only the compiled code + production dependencies

Benefits:
- ✅ Smaller final image (no dev dependencies)
- ✅ Faster startup in production
- ✅ Secure (TypeScript source code not included)

## Common Docker Commands

```bash
# Build image
docker build -t nest-auth-api:latest .

# Run container
docker run -p 3000:3000 nest-auth-api:latest

# View running containers
docker ps

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>

# Remove image
docker rmi nest-auth-api:latest

# Compose commands
docker-compose up          # Start services
docker-compose down        # Stop services
docker-compose logs        # View logs
docker-compose ps          # List services
```

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` or `DB_HOST` environment variables
- Ensure Postgres is running (if using local Postgres)
- If using Neon, verify credentials are correct

### "Port 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill it
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### "Docker image build fails"
```bash
# Clear build cache and rebuild
docker build --no-cache -t nest-auth-api:latest .
```

### "Module not found" in container
- Ensure `npm ci` (or `npm install`) runs during build
- Check `Dockerfile` includes `COPY` of necessary files
- Verify `node_modules` is in `.dockerignore`

## Next Steps

1. Test locally with `docker-compose up`
2. Run migrations if needed: `docker-compose exec backend npm run migration:run`
3. Push to GitHub
4. Deploy to Northflank
5. Update frontend `API_BASE_URL` to Northflank's public URL

## Resources

- [Docker Documentation](https://docs.docker.com)
- [NestJS Docker Guide](https://docs.nestjs.com/deployment/docker)
- [Northflank Docs](https://northflank.com/docs)
