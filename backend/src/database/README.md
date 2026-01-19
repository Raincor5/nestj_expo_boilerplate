# Database Setup with Row-Level Security

## PostgreSQL Setup (Neon or Local)

### Neon (recommended)

1. Create a Neon project and note the provided `DATABASE_URL` (includes `sslmode=require`).
2. Set `DB_SSL=true` (default) so TypeORM connects with SSL.
3. Use the same connection string for migrations or psql, e.g.: `psql "$DATABASE_URL" -f src/database/migrations/001-setup-rls.sql`.

### Local

1. Install PostgreSQL locally (if not already installed)
2. Create a database:
   ```sql
   CREATE DATABASE auth_db;
   ```

## Row-Level Security (RLS)

The RLS policies are defined in `migrations/001-setup-rls.sql`. However, for local development, TypeORM's `synchronize: true` will create the tables automatically.

To apply RLS policies manually:

```bash
psql -U postgres -d auth_db -f src/database/migrations/001-setup-rls.sql
```

## Important Notes

1. **Production**: Set `synchronize: false` and use migrations
2. **RLS**: The policies ensure users can only access their own data
3. **Security**: Password and refresh token hashes are protected from direct updates

## Manual RLS Setup (Production)

If using migrations in production:

1. Disable `synchronize` in `app.module.ts`
2. Run TypeORM migrations to create tables
3. Apply RLS policies from the SQL file
4. Ensure your database user has appropriate permissions
