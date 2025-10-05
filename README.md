# Health & Productivity Tracker

A Next.js application that tracks your health metrics from Google Fit and productivity through an AI-powered task management system.

## Features

- 🏃 **Google Fit Integration**: Automatically sync steps, calories, and distance
- 📊 **Activity Rings**: Visual representation with productivity and health scores
- ✅ **Smart To-Do List**: Expandable notes with day/week views
- 🤖 **AI-Powered Task Scoring**: Claude API scores tasks based on effort
- 🌓 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on mobile and desktop
- 🔐 **Supabase Auth**: Secure authentication and data storage

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth & Database)
- Claude API (Anthropic)
- Google Fit API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Console project with Google Fit API enabled
- Anthropic API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   NEXT_PUBLIC_GOOGLE_CLIENT_ID=582076125984-kt7so9jkslet6kmgijpa4ik6dc329fgn.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   ANTHROPIC_API_KEY=your-anthropic-api-key

   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Set up your Supabase database using the schema in `supabase/schema.sql`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses three main tables:

- `users`: User profiles with Google OAuth tokens
- `tasks`: To-do items with AI-generated effort scores
- `health_data`: Daily health metrics from Google Fit

See the Supabase types in `src/lib/supabase/types.ts` for the complete schema.

## Project Structure

```
src/
├── app/                  # Next.js app router pages
├── components/           # React components
├── lib/
│   ├── supabase/        # Supabase client and types
│   ├── google-fit/      # Google Fit API integration
│   ├── claude/          # Claude API for task scoring
│   └── utils/           # Utility functions
```

## License

MIT
