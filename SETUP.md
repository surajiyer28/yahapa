# Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor** and run the entire `supabase/schema.sql` file
3. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## 3. Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID or create a new one:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/google-fit/callback`
   - For production, add: `https://yourdomain.com/api/google-fit/callback`
5. Copy the **Client Secret**
6. Go to **APIs & Services** → **Library**
7. Search for and enable:
   - **Fitness API** (or Google Fit API)

## 4. Set Up Anthropic API

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Copy the key (starts with `sk-ant-`)

## 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from example
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Fit OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=582076125984-kt7so9jkslet6kmgijpa4ik6dc329fgn.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Claude API
ANTHROPIC_API_KEY=sk-ant-your-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Test the App

1. **Sign Up**: Create a new account
2. **Add Tasks**: Click "Add Task" and create a few tasks
   - They will automatically be scored by Claude AI (1-10 effort)
3. **Connect Google Fit**: Click "Connect Google Fit" button
   - Authorize access to your Google Fit data
   - You'll be redirected back to the dashboard
4. **Sync Health Data**: Click "Sync Health" to fetch today's metrics
5. **View Activity Rings**: Watch the rings fill based on your productivity and health scores
6. **Toggle Theme**: Use the moon/sun icon to switch between dark and light mode
7. **Rescore Tasks**: Click "Rescore Tasks" to have Claude re-evaluate all tasks

## Features

✅ Activity rings with productivity (left) and health (right) halves
✅ Smiley face in center changes expression based on scores
✅ AI-powered task scoring using Claude API
✅ Google Fit integration for health metrics
✅ Day/Week view toggle
✅ Task list with expandable notes
✅ Dark/light mode
✅ Responsive design

## Troubleshooting

### "User not found" error
Make sure the Supabase trigger was created correctly. Run the schema.sql again.

### Google Fit not connecting
- Check that the Fitness API is enabled in Google Cloud Console
- Verify the redirect URI matches exactly (including http/https)
- Make sure GOOGLE_CLIENT_SECRET is correct

### Tasks not scoring
- Verify ANTHROPIC_API_KEY is correct
- Check browser console for API errors

### Database errors
- Ensure all tables were created from schema.sql
- Check RLS policies are enabled
