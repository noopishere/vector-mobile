# Vector Mobile 📱

**News & Prediction Markets App**

Mobile companion app for [vector.markets](https://vector.markets) - trade prediction markets with precision.

Built with React Native + Expo for iOS, Android, and Web.

## Features

### 📰 News Feed
- Real-time news aggregation from multiple sources
- Categorized by market relevance (Tech, Finance, Crypto, Politics)
- Sentiment indicators (bullish/bearish/neutral)
- Pull-to-refresh for latest updates

### 📊 Prediction Markets
- Browse active markets with live odds
- Category filtering (Technology, Economics, Crypto, Politics)
- Visual probability bars with animations
- Quick trade buttons (YES/NO)
- Market stats (volume, liquidity, traders)

### 💼 Portfolio
- Track your positions in real-time
- P&L display (absolute and percentage)
- Position details (shares, avg price, current price)
- Portfolio statistics overview
- Win rate tracking

### ⚙️ Settings
- Account management
- Notification preferences
- Data sync controls
- Theme settings (dark mode default)

## Design

Minimal, monospace aesthetic matching vector.markets:

- **Background**: `#0a0a0a` (near black)
- **Surface**: `#121212` (cards, elevated surfaces)  
- **Primary**: `#00ff88` (vibrant green accent)
- **Secondary**: `#00aaff` (blue)
- **Positive**: `#00ff88` (green for gains)
- **Negative**: `#ff4444` (red for losses)

Typography: Monospace fonts throughout with generous letter-spacing for labels.

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Navigation**: React Navigation (Bottom Tabs)
- **Styling**: StyleSheet (with NativeWind ready)

## Project Structure

```
vector-mobile/
├── App.tsx                 # Main app entry with providers
├── src/
│   ├── api/
│   │   ├── client.ts       # API client setup
│   │   └── hooks.ts        # React Query hooks
│   ├── components/
│   │   ├── NewsCard.tsx    # News article card
│   │   ├── MarketCard.tsx  # Market prediction card
│   │   └── PositionCard.tsx # Portfolio position card
│   ├── data/
│   │   └── dummyData.ts    # Mock data for development
│   ├── navigation/
│   │   └── TabNavigator.tsx # Bottom tab navigation
│   ├── screens/
│   │   ├── NewsScreen.tsx
│   │   ├── MarketsScreen.tsx
│   │   ├── PortfolioScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/
│   │   └── useAppStore.ts  # Zustand state store
│   └── theme/
│       └── colors.ts       # Design system colors
├── app.json                # Expo config
├── package.json
└── tsconfig.json
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/noopishere/vector-mobile.git
cd vector-mobile

# Install dependencies
npm install

# Start the development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

### Requirements

- Node.js 18+
- npm or yarn
- Expo CLI (installed via npx)
- iOS: Xcode (for simulator)
- Android: Android Studio (for emulator)

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |

## Roadmap

- [x] Project setup with Expo + TypeScript
- [x] Tab navigation (News, Markets, Portfolio, Settings)
- [x] News feed with animated cards
- [x] Markets list with filters
- [x] Portfolio tracking screen
- [x] Settings screen
- [x] Loading skeletons
- [x] Pull-to-refresh
- [ ] Real API integration
- [ ] User authentication
- [ ] Push notifications
- [ ] Trading functionality
- [ ] Dark/light theme toggle
- [ ] Charts and graphs

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

Built by [Noop](https://x.com/smart_noop) ⚡
