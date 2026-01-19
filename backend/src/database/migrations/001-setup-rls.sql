-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Note: RLS policies using CURRENT_USER or application-level context
-- For this implementation, RLS is enabled but policies rely on application layer
-- to set appropriate database roles/context. In production, you would:
-- 1. Create database roles for each user, OR
-- 2. Use a service role for application connections and enforce RLS at app layer

-- Policy: Prevent direct table access (optional - for production with proper role setup)
-- This is a restrictive policy that denies all unless accessed through app layer
-- For development, we rely on application-layer security

-- For production with role-based access, you would set:
-- CREATE POLICY "Users can view own data"
--   ON users FOR SELECT
--   USING (current_setting('app.user_id') = id::text);

-- Application Layer Security:
-- 1. All queries use service role (application credentials)
-- 2. Application validates JWT tokens before database queries
-- 3. Application only returns data for authenticated user
-- 4. Application prevents direct updates to password_hash and refresh_token_hash

-- Create a function to verify user ownership (helper for application layer)
CREATE OR REPLACE FUNCTION verify_user_ownership(user_id UUID, requesting_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id = requesting_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for better performance on email lookups (already handled by unique constraint)
-- Index for refresh token expiration cleanup
CREATE INDEX IF NOT EXISTS idx_users_refresh_token_expires_at 
  ON users(refresh_token_expires_at) 
  WHERE refresh_token_hash IS NOT NULL;

-- Note: For more advanced RLS with Supabase-style auth, you would:
-- 1. Install pgcrypto extension
-- 2. Use Supabase auth schema or implement custom auth.uid() equivalent
-- 3. Set session variables via SET LOCAL in transactions
