# Database Architecture & Vercel Deployment Guide

## ⚠️ Important: Database Limitation on Vercel

You have requested that both the Web App (on Vercel) and the Telegram Bot (`polway_bot`) share the same database (`nexus_media_bot.py`'s database).

**Current Challenge:**
- **Telegram Bot** uses a local SQLite file (`mega_bot.db`).
- **Vercel** is a serverless platform. It cannot read/write to a persistent local SQLite file because the file system is ephemeral (it resets after every request/deployment).

**Consequence:**
- If you deploy to Vercel with SQLite, user data (XP, Gold, Level) will **reset** constantly or not be shared with the Bot.

## ✅ Recommended Solution: Supabase (PostgreSQL)

To achieve a true shared database between your Vercel Web App and your Python Telegram Bot, you must use a cloud database. **Supabase** is the best free option.

### Step 1: Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Get your `SUPABASE_URL` and `SUPABASE_KEY`.
3. Run the SQL editor in Supabase to create your `users` table (matching your bot's schema).

### Step 2: Configure Environment Variables
**For Vercel:**
Add these to your Vercel Project Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Key

**For Python Bot (`.env` file):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Step 3: Update Code
I have prepared `polway_bot_supabase.py` as a template for your Python bot to sync data with Supabase.

For the Next.js app, you will need to install the supabase client:
```bash
npm install @supabase/supabase-js
```

And update your API routes (`app/api/...`) to read/write from Supabase instead of mock data or local SQLite.

## 🚀 Current Status (What works now)

1.  **Vercel Deployment:** Fixed configuration errors. The app should now build and deploy successfully.
2.  **UI/UX:**
    *   **Navigation:** Switched to "Hub & Spoke" (Stack) model. No more accidental swipes.
    *   **Game:** Added "Quantum 2048" game.
    *   **Design:** Professional "Quantum Apex" theme.
3.  **Telegram Integration:**
    *   App checks for Telegram context.
    *   Redirects to `polway_bot` for subscription verification.
    *   Displays user data from Telegram WebApp init data.

**Next Steps for You:**
1.  Verify the Vercel deployment at your URL.
2.  Set up Supabase if you want real persistence across devices.
