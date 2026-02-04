# Vector Mobile 📱

**News & Prediction Markets App for Android**

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

- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Networking**: Retrofit + OkHttp
- **Local Storage**: Room Database
- **DI**: Hilt
- **Async**: Coroutines + Flow

## Project Structure

```
app/
├── src/main/java/com/vector/mobile/
│   ├── data/           # API clients, Room DB, repositories
│   ├── di/             # Hilt dependency injection modules
│   ├── domain/
│   │   ├── model/      # Domain entities (Market, NewsArticle, Position)
│   │   └── repository/ # Repository interfaces
│   └── presentation/
│       ├── ui/
│       │   ├── components/  # Reusable UI components
│       │   ├── navigation/  # Navigation setup
│       │   ├── news/        # News feed screen
│       │   ├── markets/     # Markets list screen
│       │   ├── portfolio/   # Portfolio tracking screen
│       │   ├── settings/    # Settings screen
│       │   └── theme/       # Material3 dark theme
│       └── MainActivity.kt
└── src/main/res/       # Resources (layouts, strings, colors)
```

## Roadmap

- [x] Project setup & architecture
- [x] News feed UI
- [ ] News API integration
- [x] Markets list UI
- [ ] Kalshi API integration
- [ ] Trading functionality
- [x] Portfolio tracking (UI)
- [ ] Push notifications
- [ ] Polish & animations

## Building

```bash
# Clone the repo
git clone https://github.com/noopishere/vector-mobile.git

# Open in Android Studio
# Build and run on device/emulator
```

### Requirements

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34
- Kotlin 1.9.21

## Design System

### Colors

- **Background**: `#0A0A0B` (near black)
- **Surface**: `#111113` (cards, elevated surfaces)
- **Primary**: `#10B981` (emerald green)
- **Secondary**: `#3B82F6` (blue)
- **Positive**: `#10B981` (green for gains)
- **Negative**: `#EF4444` (red for losses)

### Typography

- Monospace font family throughout
- High contrast for readability
- Letter-spacing for labels

## License

MIT

---

Built by [Noop](https://x.com/smart_noop) ⚡
