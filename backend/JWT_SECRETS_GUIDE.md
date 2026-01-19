# JWT Secrets Guide

## What are JWT Secrets?

JWT secrets are **random strings** used to sign and verify JWT tokens. They're not tokens themselves - they're the "keys" that prove a token is legitimate.

## How JWT Secrets Work

- **Signing**: When creating a token, the secret is used to create a signature
- **Verification**: When verifying a token, the same secret is used to validate the signature
- **Security**: If someone doesn't have your secret, they can't forge valid tokens

## Requirements

- **Minimum length**: 32+ characters (longer is better)
- **Randomness**: Use cryptographically secure random strings
- **Different secrets**: Access and refresh tokens should use **different** secrets
- **Keep secret**: Never commit secrets to git or share them publicly

## How to Generate Secure JWT Secrets

### Option 1: Using Node.js (Recommended)

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

This will output a 128-character hexadecimal string. Run it **twice** to get two different secrets:
- One for `JWT_SECRET`
- One for `JWT_REFRESH_SECRET`

### Option 2: Using OpenSSL (All Platforms)

```bash
# Generate JWT_SECRET
openssl rand -hex 64

# Generate JWT_REFRESH_SECRET (run again for different value)
openssl rand -hex 64
```

### Option 3: Using Online Generator (Development Only)

For **development only**, you can use: https://generate-secret.vercel.app/64

⚠️ **Never use online generators for production secrets!**

### Option 4: Using PowerShell (Windows)

```powershell
# Generate JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Or use .NET method
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

## Example .env File

After generating your secrets, your `.env` file should look like this:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db

# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
JWT_REFRESH_SECRET=f6e5d4c3b2a1098765432109876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

## Important Notes

1. **Different Secrets**: `JWT_SECRET` and `JWT_REFRESH_SECRET` must be **different** values
2. **Don't Reuse**: Generate new secrets for each environment (dev, staging, production)
3. **Never Commit**: `.env` files should be in `.gitignore` (already configured)
4. **Rotate Secrets**: If a secret is compromised, generate a new one and invalidate existing tokens

## What if I Use Weak Secrets?

- ❌ Short or predictable secrets can be brute-forced
- ❌ Same secret for access/refresh tokens reduces security
- ❌ Reused secrets across environments risks cross-environment attacks

## Quick Command to Generate Both Secrets

```bash
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env
echo "JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env
```

Then manually copy the values into your `.env` file in the correct format.
