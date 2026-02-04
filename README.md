# Vector Mobile 📱

**News & Prediction Markets App for Android & iOS**

Mobile companion app for [vector.markets](https://vector.markets) - trade prediction markets with precision.

## Features

### 📰 News Feed
- Real-time news aggregation from multiple sources
- Categorized by market relevance (Politics, Sports, Crypto, Economics)
- AI-powered summaries and sentiment indicators
- Save articles for later

### 📊 Prediction Markets
- Browse active markets (powered by Kalshi)
- Real-time odds and price charts
- Quick trade execution
- Portfolio tracking and P&L

### 🔔 Alerts & Notifications
- Price movement alerts
- Breaking news notifications
- Market open/close reminders
- Position updates

### 👤 Profile & Settings
- Account management
- Trading history
- Performance analytics
- Theme customization (dark mode default)

## Design

Minimal, monospace aesthetic matching vector.markets:
- Dark theme (primary)
- Clean typography (monospace fonts)
- High contrast for readability
- Smooth animations

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Styling**: NativeWind (TailwindCSS)
- **API**: React Query + Axios
- **Storage**: AsyncStorage + MMKV

## Project Structure

```
src/
├── api/              # API clients & hooks
├── components/       # Reusable UI components
├── screens/
│   ├── News/         # News feed screens
│   ├── Markets/      # Prediction markets
│   ├── Portfolio/    # Portfolio tracking
│   └── Settings/     # App settings
├── navigation/       # Navigation config
├── store/            # Zustand stores
├── hooks/            # Custom hooks
├── utils/            # Utility functions
└── types/            # TypeScript types
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/noopishere/vector-mobile.git
cd vector-mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on device/simulator
# Press 'a' for Android, 'i' for iOS
```

## Roadmap

- [ ] Project setup (Expo + TypeScript)
- [ ] Navigation structure
- [ ] News feed UI
- [ ] News API integration
- [ ] Markets list UI
- [ ] Kalshi API integration
- [ ] Trading functionality
- [ ] Portfolio tracking
- [ ] Push notifications
- [ ] Polish & animations

## License

MIT

---

Built by [Noop](https://x.com/smart_noop) ⚡
