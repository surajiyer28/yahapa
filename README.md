# YAHAPA - Your Health and Productivity App

A comprehensive Next.js application that tracks your health metrics, productivity tasks, daily habits, and focus time through an intuitive dashboard with beautiful visualizations.

## ✨ Features

### 📊 Activity Rings & Dashboard
- **Visual Progress Tracking**: Apple-style activity rings showing productivity and health scores
- **Animated Smiley Face**: Dynamic emotion indicator that reflects your daily performance
- **Real-time Statistics**: Track steps, calories burned, and productivity points

### 🏃 Google Fit Integration
- Automatic sync of health data (steps, calories, distance)
- Daily health score calculation based on fitness goals
- OAuth 2.0 secure authentication with Google

### ✅ Smart Task Management
- **AI-Powered Scoring**: Claude API automatically evaluates task effort (1-10 scale)
- **Expandable Notes**: Add detailed descriptions to any task
- **Flexible Views**: Switch between Current day and All tasks
- **Date Navigation**: Easy date picker to view tasks from any day
- **Due Date Support**: Set and track task deadlines

### 🍅 Pomodoro Timer
- 25-minute focus timer with start/pause functionality
- Visual navbar indicator (red shade) when timer is active
- Browser notifications when session completes
- Automatic productivity point rewards (10 points per completed session)
- Tracks all completed pomodoros by date

### 🔥 Habit Streak Tracker
- **GitHub-Style Contribution Calendar**: Beautiful year-long visualization of your habit consistency
- **Custom Habits**: Create and track unlimited personal habits (Gym, Reading, Meditation, etc.)
- **Smart Color Coding**:
  - Gray: 0% habits completed
  - Light Blue: 1-49% completed
  - Medium Blue: 50-99% completed
  - Dark Blue: 100% completed
- **Interactive Calendar**: Hover tooltips showing completion details for any date
- **12-Month View**: Track your progress across the entire year
- **Flexible Tracking**: Mark habits complete for any date, not just today

### 🌓 Theme Support
- Full dark/light mode toggle
- Seamless theme switching with automatic canvas updates
- Consistent theming across all components

### 🔐 Authentication & Security
- Supabase Auth with email verification
- Professional verification email notifications
- Row-Level Security (RLS) for all data
- Secure password handling

### 📱 Responsive Design
- Mobile-first approach
- Optimized layouts for all screen sizes
- Touch-friendly interface
- Horizontal scrolling calendar on mobile

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Claude API (Anthropic)
- **Health Data**: Google Fit API
- **Icons**: Lucide React
- **Canvas Graphics**: HTML5 Canvas for activity rings

## 📦 Database Schema

The application uses the following tables:

### Core Tables
- **users**: User profiles with Google OAuth tokens and metadata
- **tasks**: To-do items with AI-generated effort scores and due dates
- **health_data**: Daily health metrics synced from Google Fit

### Pomodoro System
- **pomodoro_sessions**: Tracks completed 25-minute focus sessions by date

### Habit Tracking
- **streak_items**: User-defined habits to track
- **streak_completions**: Daily completion records for each habit

All tables include Row Level Security (RLS) policies for data protection.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Google Cloud Console project with Google Fit API enabled
- Anthropic API key (for Claude)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Google Fit API
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Claude API (Anthropic)
   ANTHROPIC_API_KEY=your-anthropic-api-key

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**

   Run the migration files in your Supabase SQL Editor in this order:
   ```bash
   supabase/schema.sql                          # Base schema
   supabase/migrations/add_pomodoro_sessions.sql # Pomodoro tracking
   supabase/migrations/add_streak_tracking.sql   # Habit tracking
   ```

5. **Configure Google Fit OAuth**
   - Enable Google Fit API in Google Cloud Console
   - Add authorized redirect URIs: `http://localhost:3000/api/google-fit/callback`
   - Configure OAuth consent screen

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
health-app/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── google-fit/      # Google Fit integration
│   │   │   ├── pomodoro/        # Pomodoro session tracking
│   │   │   ├── streaks/         # Habit streak management
│   │   │   ├── tasks/           # Task CRUD operations
│   │   │   └── user/            # User management
│   │   ├── dashboard/           # Main dashboard page
│   │   ├── login/              # Authentication page
│   │   └── layout.tsx          # Root layout
│   ├── components/              # React components
│   │   ├── ActivityRings.tsx   # Canvas-based activity visualization
│   │   ├── PomodoroTimer.tsx   # Focus timer component
│   │   ├── StreakCalendar.tsx  # GitHub-style contribution calendar
│   │   ├── StreakList.tsx      # Habit management interface
│   │   ├── StreakTracker.tsx   # Main habit tracking container
│   │   ├── TaskList.tsx        # Task management interface
│   │   ├── ThemeProvider.tsx   # Dark/light mode context
│   │   └── Toast.tsx           # Notification component
│   ├── hooks/                   # Custom React hooks
│   │   ├── useHealthData.ts    # Google Fit data management
│   │   ├── usePomodoro.ts      # Pomodoro session tracking
│   │   ├── useStreaks.ts       # Habit streak management
│   │   └── useTasks.ts         # Task CRUD operations
│   └── lib/                     # Utility libraries
│       ├── supabase/           # Supabase client & types
│       ├── google-fit/         # Google Fit API integration
│       ├── claude/             # Claude API for task scoring
│       └── utils/              # Helper functions
├── supabase/                    # Database migrations
└── public/                      # Static assets
```

## 🎯 Key Components

### Activity Rings
- Canvas-based visualization with three concentric rings
- Outer ring: Steps progress (goal: 10,000 steps)
- Middle ring: Calories burned (goal: 2,000 cal)
- Inner ring: Overall productivity + health score
- Animated smiley face with expressive eyes and dynamic smile

### Pomodoro Timer
- Integrated into dashboard header
- Red button when active, normal when paused
- Automatic notification on completion
- Navbar changes to red shade during active session

### Streak Calendar
- 12-month horizontal calendar view
- Compact GitHub-style visualization
- Color intensity based on completion percentage
- Interactive tooltips with detailed information
- Responsive: shows most recent data first on small screens

## 🔄 Data Flow

1. **User Authentication**: Supabase Auth handles signup/login with email verification
2. **Health Data Sync**: Google Fit OAuth → API fetch → Supabase storage → Dashboard display
3. **Task Management**: User input → Claude API scoring → Database storage → UI update
4. **Pomodoro Sessions**: Timer completion → Database log → Points calculation → Activity rings
5. **Habit Tracking**: User marks habits → Database record → Calendar visualization update

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Activity ring design inspired by Apple Watch
- Streak calendar inspired by GitHub contribution graphs
- Task scoring powered by Claude (Anthropic)
- Health data integration via Google Fit API
