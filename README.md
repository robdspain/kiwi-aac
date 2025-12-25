# Kiwi Voice 🥝

A powerful, privacy-first Picture Exchange Communication app designed for children and adults with speech delays or autism. Built with React, Vite, and Capacitor for high-performance iOS and Android deployment.

## 🚀 Key Features

- **6+ Phases of Development:** Supports progressive learning from simple requests to complex commenting.
- **Character Builder:** Personalized vector avatar creator to increase student engagement.
- **Visual Schedules:** Built-in routine builder with step-by-step navigation.
- **Voice Recording:** Custom audio recording for every symbol to provide familiar voice prompts.
- **Progress Tracking:** Detailed usage analytics for therapists and caregivers.
- **Guided Access Ready:** Integrated instructions and lock mode optimized for iPad/iPhone safety.
- **Privacy First:** 100% offline-first. All communication data and voice recordings stay on the device.

## 🛠 Tech Stack

- **Frontend:** React 19 + Vite
- **Mobile Bridge:** Capacitor 8
- **State Management:** React Context API + LocalStorage
- **Haptics:** @capacitor/haptics
- **Sharing/Backup:** @capacitor/share + @capacitor/filesystem
- **Styling:** CSS3 (optimized for mobile touch targets)

## 📦 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Xcode 16+ (for iOS build)
- Android Studio (for Android build)

### Installation
```bash
# Install dependencies
npm install

# Run in development mode (Web)
npm run dev
```

### Building for iOS
```bash
# Sync web assets and plugins to native project
npm run sync

# Open project in Xcode
npm run ios
```

## 📄 Metadata & Privacy
- **App Store Metadata:** See `APP_STORE_METADATA.md`
- **Privacy Policy:** See `public/privacy.html`

## ⚖️ License
© 2024 Behavior School LLC. All rights reserved.