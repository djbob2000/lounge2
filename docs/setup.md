# Initial Setup & Running the Project

This project uses Next.js App Router, Shadcn UI, Better Auth, Drizzle ORM, and Cloudflare R2 for a complete photographer portfolio.

## 1. Environment Variables

Create a `.env` file based on `.env.example` (or with the following variables):

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db"

# Cloudflare R2
R2_ACCOUNT_ID="your_account_id"
R2_ACCESS_KEY_ID="your_access_key"
R2_SECRET_ACCESS_KEY="your_secret_key"
R2_BUCKET_NAME="portfolio"
NEXT_PUBLIC_R2_PUBLIC_URL="https://pub-xxxxxx.r2.dev"

# Better Auth
BETTER_AUTH_SECRET="your_random_secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 2. Database Migrations

Run Drizzle Kit to sync the schema to your Postgres database:

```bash
npx drizzle-kit push
```

## 3. Creating the First Admin

To secure the admin panel, public registration is **disabled**.
To create the first admin user:

1. Temporarily open `src/lib/auth.ts`.
2. Find `emailAndPassword: { enabled: true }` and add `requireEmailVerification: false`.
3. Create a temporary script or temporarily allow signup via a custom form/curl command calling BetterAuth `signUpEmail`.
   Alternatively, you can manually insert the admin user into the Postgres `user` and `account` tables using a secure hashed password.

## 4. Running the Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/admin` to log in and start managing your portfolio.
