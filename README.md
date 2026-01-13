# Nexus Quantum Apex Web App 🚀

**The Ultimate Web3 Gaming & Media Platform with Quantum Effects**

Nexus Quantum Apex is a cutting-edge web application integrated with Telegram, featuring advanced gamification, AI-powered quizzes, mining farms, real-time WebSocket connections, and a comprehensive media library. Built with Next.js, TypeScript, and Tailwind CSS with stunning quantum-themed visual effects.

## 🌟 Key Features

### 🎮 Gamification System
- **XP & Gold Economy:** Earn rewards for every action
- **Crystal Mining:** Interactive mining with energy management
- **Battle System:** PvP battles with real-time matchmaking
- **Daily Bonuses:** Spin the wheel for daily rewards
- **Streak System:** Maintain daily activity streaks

### 🌌 Quantum Visual Effects
- **Quantum Background:** Animated particle system with neural connections
- **Quantum Loader:** Beautiful loading animations with progress tracking
- **Quantum Cards:** Glass-morphism cards with dynamic glow effects
- **Quantum Buttons:** Interactive buttons with hover animations
- **Quantum Progress Bars:** Smooth animated progress indicators
- **Floating Particles:** Ambient particle effects for immersion

### 🔄 Real-time Features
- **WebSocket Integration:** Live updates and instant notifications
- **Live Leaderboard:** Real-time ranking updates across all users
- **Battle Invitations:** Real-time PvP challenge system
- **Mining Rewards:** Instant reward notifications
- **User Stats Sync:** Real-time stat synchronization between devices

### 📚 Media Library
- **Content Management:** Books, movies, courses, podcasts
- **Download System:** Offline content access
- **Rating System:** User ratings and reviews
- **Premium Content:** Subscription-based exclusive content

### 🤝 Social Features
- **Referral System:** Invite friends and earn rewards
- **Leaderboard:** Global and friend rankings
- **Friend System:** Connect with other players
- **Achievement Sharing:** Share accomplishments

## 🛠 Development

### Prerequisites
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **npm** or **yarn** package manager

### Quick Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/nexus-web-app.git
   cd nexus-web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```
   
4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### TypeScript Configuration
The project uses relaxed TypeScript settings for development:
- `strict: false` - Allows more flexibility during development
- `noImplicitAny: false` - Reduces type checking strictness
- Custom type definitions in `types/telegram.d.ts` for Telegram WebApp API

### Environment Variables
Create `.env.local` with:
```env
# Database Configuration
DATABASE_PATH="../nexus/mega_bot.db"

# Telegram Bot Integration
TELEGRAM_BOT_TOKEN=your_bot_token_here
WEB_APP_URL=https://your-domain.com

# Security
JWT_SECRET=your_super_secret_jwt_key
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: Redis for session storage
REDIS_URL=redis://localhost:6379
```

### Production Build
```bash
npm run build
npm start
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run export       # Export static files
```

## 🚀 API Routes

### User Management
- `GET /api/user?telegramId={id}` - Fetch user profile and stats
- `POST /api/user` - Update user profile information

### Mining System
- `POST /api/mining` - Mine crystals (consumes energy)
- `GET /api/mining/stats` - Get detailed mining statistics

### Quiz System
- `GET /api/quiz?category={type}&difficulty={level}` - Get quiz questions
- `POST /api/quiz` - Submit quiz answers and get results

### Battle System
- `GET /api/battle` - Get battle statistics and history
- `POST /api/battle` - Start or join a battle

### Daily Bonus
- `GET /api/daily-bonus?telegramId={id}` - Check bonus availability
- `POST /api/daily-bonus` - Claim daily bonus reward

### Library System
- `GET /api/library?category={type}&type={format}` - Get content list
- `POST /api/library/download` - Download content for offline access
- `POST /api/library/rate` - Rate and review content

### Social Features
- `GET /api/social` - Get social data (friends, leaderboard)
- `POST /api/social/referral` - Claim referral bonus
- `POST /api/social/invite` - Invite friends

## 🔌 WebSocket Events

### Client → Server Events
```javascript
// Send user stat updates
socket.emit('user_update', { level: 5, xp: 1500 });

// Send battle invitation
socket.emit('battle_invite', { toUserId: 123 });

// Accept/decline battle
socket.emit('accept_battle_invite', { roomId: 'battle_123' });
socket.emit('decline_battle_invite', { roomId: 'battle_123' });

// Submit quiz results
socket.emit('quiz_result', { score: 85, correctAnswers: 8 });

// Send mining reward
socket.emit('mining_reward', { goldMined: 50, crystalsMined: 5 });

// Room management
socket.emit('join_room', { roomId: 'user_123' });
socket.emit('leave_room', { roomId: 'user_123' });
```

### Server → Client Events
```javascript
// Receive user updates
socket.on('user_update', (data) => {
  // Update local user stats
});

// Receive battle invitations
socket.on('battle_invite', (data) => {
  // Show battle invitation modal
});

// Receive quiz results
socket.on('quiz_result', (data) => {
  // Update quiz stats and show rewards
});

// Receive mining rewards
socket.on('mining_reward', (data) => {
  // Add rewards to user inventory
});

// Leaderboard updates
socket.on('leaderboard_update', (data) => {
  // Refresh leaderboard display
});

// Friend status updates
socket.on('friend_online', (data) => {
  // Show friend as online
});
socket.on('friend_offline', (data) => {
  // Show friend as offline
});
```

## 🎨 Components

### Quantum Effects Components
```jsx
import { 
  QuantumBackground, 
  QuantumLoader, 
  QuantumButton, 
  QuantumCard, 
  QuantumProgressBar,
  FloatingParticles,
  QuantumGlow
} from '@/components/quantum-effects';

// Usage examples
<QuantumBackground />
<QuantumLoader />
<QuantumButton variant="primary" onClick={handleClick}>
  Click me!
</QuantumButton>
<QuantumCard glowColor="purple">
  <h3>Card Content</h3>
</QuantumCard>
<QuantumProgressBar value={75} max={100} color="blue" />
<FloatingParticles count={20} />
<QuantumGlow color="purple" intensity="high">
  <div>Glowing content</div>
</QuantumGlow>
```

### Custom Hooks
```jsx
import { useWebSocket } from '@/lib/websocket';

function MyComponent() {
  const { isConnected, on, sendUserUpdate } = useWebSocket();
  
  useEffect(() => {
    on('user_update', (data) => {
      console.log('Received update:', data);
    });
  }, [on]);
  
  return <div>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</div>;
}
```

## 🎯 Styling System

### CSS Custom Properties
```css
/* Quantum Color Palette */
--color-purple: #8B5CF6;
--color-blue: #3B82F6;
--color-green: #10B981;
--color-gold: #FFD700;
--color-red: #FF3366;

/* Psychological Colors */
--wealth-gold: #FFD700;
--urgency-red: #FF3366;
--trust-blue: #3B82F6;
--magic-purple: #8B5CF6;
--growth-green: #10B981;

/* Quantum Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-quantum: linear-gradient(45deg, #8B5CF6, #3B82F6, #10B981);

/* Effects */
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.5);
--shadow-glow-hover: 0 0 30px rgba(139, 92, 246, 0.8);
--border-radius-sm: 6px;
--border-radius-md: 12px;
--border-radius-lg: 18px;
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel dashboard
3. Configure environment variables in Vercel
4. Deploy automatically on git push

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t nexus-web-app .
docker run -p 3000:3000 nexus-web-app
```

### Traditional VPS Hosting
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start npm --name "nexus-app" -- start

# Or start directly
npm start
```

## 🔗 Telegram Bot Integration

### Connection Points
1. **Shared Database**: Both web app and bot use `mega_bot.db`
2. **WebApp URL**: Bot opens web app via Telegram WebApp API
3. **User Authentication**: Uses Telegram user data for seamless auth
4. **Real-time Sync**: WebSocket keeps both platforms synchronized

### Bot Configuration
```python
# In your nexus_media_bot.py
WEB_APP_URL = 'https://your-domain.com'

# WebApp button
bot.send_message(
    chat_id,
    "🚀 Open Nexus Web App",
    reply_markup=InlineKeyboardMarkup([[
        InlineKeyboardButton("🌐 Open Web App", web_app=WebAppInfo(url=WEB_APP_URL))
    ]])
)
```

## 🧪 Development

### Project Structure
```
nexus-web-app/
├── app/
│   ├── api/              # API routes (user, mining, quiz, etc.)
│   ├── components/       # React components
│   │   └── quantum-effects.tsx  # Quantum UI components
│   ├── lib/              # Utility functions
│   │   └── websocket.ts  # WebSocket service
│   ├── globals.css       # Global styles and CSS variables
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main SPA page
├── public/
│   ├── manifest.json     # PWA manifest
│   └── favicon.ico       # Favicon
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Adding New Features
1. **API Route**: Create in `app/api/[feature]/route.ts`
2. **UI Components**: Add to `app/components/`
3. **Update Main Page**: Modify `app/page.tsx`
4. **WebSocket Events**: Add to `lib/websocket.ts`
5. **Types**: Update TypeScript interfaces
6. **Styles**: Add to `globals.css`

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run export       # Export static files
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User authentication works
- [ ] All API routes respond correctly
- [ ] WebSocket connections establish
- [ ] Quantum effects render properly
- [ ] Mobile responsive design
- [ ] All buttons and interactions work
- [ ] Data persistence across refreshes
- [ ] Error handling displays properly

### Automated Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run coverage     # Generate coverage report
```

## 🤝 Contributing

1. Fork the repository on GitHub
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Submit pull request with detailed description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues, questions, or support:
- 🐛 Create an issue on GitHub
- 💬 Join our Telegram community
- 📧 Contact development team
- 📖 Check documentation and wiki

## 🚀 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] NFT integration
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Guild system
- [ ] Tournament mode
- [ ] Streaming integration

---

**Nexus Quantum Apex** - Where quantum technology meets next-generation gaming! 🌟✨
- **Leveling System:** Progress through levels and unlock new features.
- **DNA Evolution:** Upgrade your character traits (Agility, Intelligence, Charisma, etc.).
- **Achievements:** Unlock 50+ unique badges and rewards.
- **Leaderboards:** Compete in weekly, monthly, and all-time rankings.
- **Daily Streaks:** Get bonuses for daily activity.

### ⛏️ Quantum Mining Farm
- **Idle Gameplay:** Generate XP automatically with your mining farm.
- **Upgrades:** Upgrade your farm level to increase production speed.
- **Real-time Collection:** Collect rewards and track progress.

### 🧠 AI Quiz Generator
- **AI-Powered:** Generate quizzes on any topic using OpenAI.
- **Adaptive Difficulty:** Questions adapt to your skill level.
- **Instant Feedback:** Learn from detailed explanations.

### 📱 Telegram Integration
- **WebApp Support:** Fully optimized for Telegram WebApp platform.
- **Authentication:** Seamless login via Telegram.
- **Theme Sync:** Adapts to Telegram's color scheme (Dark/Light).

### 📺 Media Library
- **Books, Movies, Courses:** Access a vast library of content.
- **Tracking:** Track your progress and downloads.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/nexus-web-app.git
    cd nexus-web-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in the values:
    ```bash
    cp .env.example .env.local
    ```
    
    ```env
    NEXT_PUBLIC_API_URL=https://your-api-url.com
    NEXT_PUBLIC_BOT_TOKEN=your_bot_token
    NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Vercel (Recommended)

1.  Push your code to GitHub.
2.  Import your repository to Vercel.
3.  Add the environment variables in Vercel project settings.
4.  Deploy!

## 📂 Project Structure

```
nexus-web-app/
├── app/                  # Next.js App Router pages
│   ├── achievements/     # Achievements page
│   ├── games/            # Games listing
│   ├── leaderboard/      # Leaderboard page
│   ├── mining/           # Mining farm page
│   ├── profile/          # User profile & DNA
│   ├── quiz/             # AI Quiz generator
│   ├── referrals/        # Referral system
│   └── page.tsx          # Dashboard (Home)
├── components/           # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # Reusable UI components (Button, Card, etc.)
├── lib/                  # Utilities (cn, etc.)
├── services/             # API services
│   ├── api.ts            # Main API client
│   ├── ai-quiz.ts        # AI Quiz service
│   └── telegram.ts       # Telegram WebApp service
├── stores/               # Zustand state management
└── types/                # TypeScript interfaces
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
