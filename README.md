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
├── data/
│   ├── api/           # API clients
│   ├── db/            # Room database
│   ├── repository/    # Data repositories
│   └── models/        # Data models
├── domain/
│   ├── models/        # Domain entities
│   ├── repository/    # Repository interfaces
│   └── usecases/      # Business logic
├── presentation/
│   ├── ui/
│   │   ├── news/      # News feed screens
│   │   ├── markets/   # Prediction markets
│   │   ├── portfolio/ # Portfolio tracking
│   │   └── settings/  # App settings
│   ├── viewmodels/    # ViewModels
│   └── components/    # Reusable UI components
└── di/                # Dependency injection
```

## Roadmap

- [ ] Project setup & architecture
- [ ] News feed UI
- [ ] News API integration
- [ ] Markets list UI
- [ ] Kalshi API integration
- [ ] Trading functionality
- [ ] Portfolio tracking
- [ ] Push notifications
- [ ] Polish & animations

## Building

```bash
# Clone the repo
git clone https://github.com/noopishere/vector-mobile.git

# Open in Android Studio
# Build and run on device/emulator
```

## License

MIT

---

Built by [Noop](https://x.com/smart_noop) ⚡
