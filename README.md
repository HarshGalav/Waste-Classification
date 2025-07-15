# EcoWaste AI - Smart Waste Management Platform

A Next.js application that uses AI to identify and categorize waste, with user authentication, points system, and leaderboard functionality.

## Features

- **Gmail Authentication**: Users can sign in with their Google accounts
- **AI Waste Analysis**: Upload images of waste for automatic categorization using Google Gemini AI
- **Points System**: Earn points for verified waste submissions (users cannot manually edit points)
- **User Profiles**: Each user has a unique profile with their stats and submission history
- **Leaderboard Dashboard**: View rankings of users based on total points earned
- **Verification System**: Community-driven verification of waste submissions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Google Gemini API for waste image analysis
- **Database**: MongoDB Atlas for data storage
- **UI Components**: Custom components with Lucide React icons

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd waste-classification
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: A random secret for NextAuth.js
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GEMINI_API_KEY`: Google Gemini API key for AI analysis
- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB`: Database name (default: ecowaste)

### 4. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add your domain to authorized origins
6. Add your callback URL: `http://localhost:3000/api/auth/callback/google`

### 5. Set up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini
3. Add the API key to your environment variables

### 6. Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and set up a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace `<username>`, `<password>`, and `<cluster-url>` in your connection string
6. Add the connection string to your `.env.local` file as `MONGODB_URI`

Example MongoDB URI format:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecowaste?retryWrites=true&w=majority
```

### 7. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Users:
1. **Sign In**: Click "Sign In with Google" to authenticate
2. **Submit Waste**: Upload images of waste items for AI analysis
3. **Earn Points**: Get points when your submissions are verified by the community
4. **View Progress**: Check your stats and submission history on the dashboard
5. **Leaderboard**: See your ranking compared to other users

### For Verifiers:
1. **Verify Submissions**: Review pending waste submissions from other users
2. **Award Points**: Verify legitimate submissions to award points to users

## Project Structure

```
app/
├── api/                    # API routes
│   ├── analyze-waste/      # AI waste analysis endpoint
│   ├── leaderboard/        # Leaderboard data endpoint
│   ├── submissions/        # Waste submissions CRUD
│   ├── users/              # User data endpoint
│   └── verify/             # Submission verification endpoint
├── app/                    # Main application page (authenticated users)
├── components/             # Reusable React components
├── dashboard/              # Leaderboard dashboard page
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configurations
│   ├── auth/               # NextAuth configuration and routes
│   ├── auth.ts             # Auth options and callbacks
│   ├── database.ts         # Database operations (MongoDB Atlas)
│   └── gemini.ts           # Google Gemini AI integration
├── types/                  # TypeScript type definitions
└── page.tsx                # Landing page
```

## Key Features Explained

### Authentication System
- Uses NextAuth.js with Google OAuth provider
- Automatically creates user profiles on first sign-in
- Session management with JWT strategy

### Points System
- Points are awarded only through verified submissions
- Users cannot manually edit their points
- Points are calculated based on waste type and quantity
- Verification system prevents point manipulation

### AI Integration
- Google Gemini AI analyzes uploaded waste images
- Identifies waste type, quantity, and confidence level
- Calculates estimated points based on analysis

### Data Storage
- Uses MongoDB Atlas cloud database for scalable data storage
- Collections: users, submissions
- Automatic indexing and optimized queries for performance
- Secure cloud-based storage with built-in backup and recovery

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service.

### Environment Variables for Production:
- Update `NEXTAUTH_URL` to your production domain
- Ensure all OAuth redirect URLs are updated in Google Cloud Console
- Keep API keys secure and never commit them to version control

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Real-time notifications
- Mobile app development
- Advanced AI models for better accuracy
- Reward redemption system
- Social features and challenges
- Admin dashboard for moderation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.