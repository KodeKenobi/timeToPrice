# Time to Price (t2p)

A modern, cross-platform agricultural cost calculation and market monitoring app built with React Native and Expo. The app helps users calculate break-even prices, track market prices, set price alerts, and manage their farming business more efficiently.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Functionality](#core-functionality)
- [Internationalization (i18n)](#internationalization-i18n)
- [Notifications](#notifications)
- [State Management](#state-management)
- [Custom Components](#custom-components)
- [Assets](#assets)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dashboard Shortcuts**: Quick access to core features like new calculations, previous calculations, market prices, and cost analysis.
- **Cost Calculation**: Input all relevant farming costs and yields to calculate break-even and profit-inclusive prices per ton.
- **Market Prices**: View live commodity prices and trends.
- **Price Alerts**: Set alerts for specific commodities and price points; receive notifications when targets are met.
- **Previous Calculations**: View and manage your calculation history.
- **Cost Analysis**: Analyze your costs and gain insights into your farming operations.
- **Notifications**: In-app and push notifications for price alerts and system messages.
- **Settings**: Toggle notifications, switch app language (English/Afrikaans), and view account options.
- **Help & FAQ**: Access help resources and frequently asked questions.
- **Internationalization**: Full support for English and Afrikaans, with easy extensibility for more languages.
- **Modern UI**: Clean, mobile-first design with custom components and theming.

---

## Screenshots

> _Add screenshots of the main screens here (Dashboard, Calculation, Market Prices, Alerts, Notifications, Settings, Help, etc.)_

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/t2p.git
   cd t2p
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```sh
   npm start
   # or
   yarn start
   ```

4. **Run on your device:**
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

---

## Project Structure

```
.
├── app/                  # Main app screens and navigation (Expo Router)
│   ├── (tabs)/           # Tabbed navigation screens (Dashboard, Calculate, Help, Settings)
│   ├── notifications/    # Notification screens
│   ├── _layout.tsx       # App layout and navigation
│   └── +not-found.tsx    # 404 screen
├── components/           # Reusable UI components
│   ├── ui/               # UI primitives (IconSymbol, ThemedText, etc.)
│   └── ...               # Feature components (HomeHeader, CalculationForm, etc.)
├── context/              # React context providers (e.g., NotificationContext)
├── lib/                  # Redux store, utilities, and business logic
├── assets/               # Fonts and images
├── scripts/              # Project scripts (e.g., reset-project.js)
├── constants/            # App-wide constants
├── credentials/          # Platform credentials (excluded from VCS)
├── i18n.ts               # Internationalization setup and translations
├── app.json              # Expo app configuration
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

---

## Core Functionality

### Dashboard

- **Shortcuts** to all major features.
- **Stats**: Alerts count, commodities tracked, last calculation time.
- **Greeting** and motivational messages.

### Cost Calculation

- Enter all relevant costs (seed, fertilizer, chemicals, labor, fuel, etc.).
- Specify hectares planted, average yield, and profit target.
- Supports insurance inclusion.
- Calculates break-even and profit-inclusive prices per ton.
- Saves calculation history for future reference.

### Market Prices

- Fetches and displays live commodity prices.
- Modal view for detailed price breakdowns.
- Polls for updates every 30 seconds and on app foreground.

### Price Alerts

- Set alerts for specific commodities and price types (High, Low, Last).
- Receive notifications when targets are met.
- Manage and delete alerts.

### Notifications

- In-app notification center.
- Push notifications for price alerts and system messages.
- Clear all or individual notifications.

### Settings

- Toggle notifications.
- Switch between English and Afrikaans (more languages can be added).
- Theme selection (system default).
- Account management (coming soon).

### Help & FAQ

- Tips for using the app.
- Frequently asked questions.
- Contact/support information.

---

## Internationalization (i18n)

- Uses `react-i18next` and `i18next`.
- English and Afrikaans translations included.
- Easily extensible: add new languages in `i18n.ts` and update the language selector in Settings.

---

## Notifications

- Uses `expo-notifications` for push and local notifications.
- Notifications are stored in local storage and managed via context.
- Alerts can trigger notifications based on live market data.

---

## State Management

- Uses Redux Toolkit for global state (alerts, notifications, etc.).
- Context API for notifications and other cross-cutting concerns.

---

## Custom Components

- **HomeHeader**: Dynamic header with stats, greeting, and notification badge.
- **CalculationForm**: Main form for cost calculations.
- **CostAnalysisModal**: Insights and analytics on costs.
- **PreviousCalculationsModal**: View and manage calculation history.
- **ParallaxScrollView, Collapsible, HapticTab, etc.**: Enhanced UI/UX.

---

## Assets

- **Images**: App icon, splash, adaptive icons, etc. in `assets/images/`.
- **Fonts**: Custom fonts in `assets/fonts/`.

---

## Configuration

- **Expo config**: See `app.json` for app name, icon, splash, and platform settings.
- **Environment variables**: Use `.env` and `.env.local` for sensitive data (Supabase keys, etc.).

---

## Scripts

- `npm start` / `yarn start`: Start Expo dev server.
- `npm run android` / `yarn android`: Run on Android device/emulator.
- `npm run ios` / `yarn ios`: Run on iOS simulator.
- `npm run web` / `yarn web`: Run in web browser.
- `npm run lint`: Lint the codebase.
- `npm run reset-project`: Custom script to reset project state.

---

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

---

## License

> _Specify your license here (MIT, Apache, etc.)_

---

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [i18next](https://www.i18next.com/)
- [date-fns](https://date-fns.org/)

---

**For more information, see the code comments and inline documentation.**
