
# MediHelper: Smart Medication Management App

<div align="center">

# Medicompanion

[![GitHub stars](https://img.shields.io/github/stars/asklokesh/medicompanion?style=social)](https://github.com/asklokesh/medicompanion/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/asklokesh/medicompanion?style=social)](https://github.com/asklokesh/medicompanion/network)
[![GitHub watchers](https://img.shields.io/github/watchers/asklokesh/medicompanion?style=social)](https://github.com/asklokesh/medicompanion/watchers)

[![License](https://img.shields.io/github/license/asklokesh/medicompanion?style=for-the-badge)](https://github.com/asklokesh/medicompanion/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/asklokesh/medicompanion?style=for-the-badge)](https://github.com/asklokesh/medicompanion/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/asklokesh/medicompanion?style=for-the-badge)](https://github.com/asklokesh/medicompanion/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/asklokesh/medicompanion?style=for-the-badge)](https://github.com/asklokesh/medicompanion/commits)

[![Commit Activity](https://img.shields.io/github/commit-activity/m/asklokesh/medicompanion?style=flat-square)](https://github.com/asklokesh/medicompanion/pulse)
[![Code Size](https://img.shields.io/github/languages/code-size/asklokesh/medicompanion?style=flat-square)](https://github.com/asklokesh/medicompanion)
[![Contributors](https://img.shields.io/github/contributors/asklokesh/medicompanion?style=flat-square)](https://github.com/asklokesh/medicompanion/graphs/contributors)

</div>

## Overview

MediHelper is a comprehensive web application designed to help senior citizens and individuals with complex medication regimens manage their health more effectively. The application offers intuitive tools for medication management, appointment tracking, pill identification, health monitoring, and caregiver communication.

## Core Features

### 🔹 Medication Management
- **My Medications**: Track all your current medications in one place
- **Add/Edit Medications**: Easily add new medications or update existing ones with dosage, frequency, and timing information
- **Medication Reminders**: Never miss a dose with customizable reminder notifications

### 🔹 Pill Identification
- **Text Search**: Find medications by name, markings, or physical characteristics
- **Image Recognition**: Upload photos of pills for automated identification
- **Comprehensive Information**: Get detailed information about identified medications including purpose, ingredients, and potential interactions

### 🔹 Appointment & Schedule Management
- **Calendar View**: See all upcoming appointments in an easy-to-read calendar
- **Reminders**: Get notified about upcoming appointments
- **Scheduling**: Add and manage healthcare appointments

### 🔹 Health Tracking
- **Adherence Tracking**: Monitor medication compliance over time
- **Health Metrics**: Record and visualize vital health measurements

### 🔹 Caregiver Connectivity
- **Video Chat**: Connect with caregivers and healthcare providers through integrated video calls
- **Care Notes**: Share important health updates with your care team
- **Caregiver Access**: Grant limited access to caregivers to help monitor medication adherence

### 🔹 Brain Health
- **Brain Games**: Simple cognitive exercises to keep the mind active
- **Memory Tools**: Memory aids and cognitive assistance features

## Technology Stack

- **Frontend**: React with TypeScript for type safety
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **API Integration**: RxNav API for medication data
- **State Management**: React Context & TanStack Query
- **Deployment**: Lovable deployment system

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd medihelper

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the application running locally.

## Mobile Development (iOS & Android)

### Prerequisites
- For iOS: macOS with Xcode 14+ installed
- For Android: Android Studio with SDK tools installed
- Capacitor CLI: `npm install -g @capacitor/cli`

### Building and Testing for iOS

```sh
# Build the web app
npm run build

# Sync the build to the iOS project
npx cap sync ios

# Open the project in Xcode
npx cap open ios

# Run on simulator
npx cap run ios

# For a specific device
npx cap run ios --target="iPhone 14 Pro"

# Build for production
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -sdk iphoneos build
```

### Building and Testing for Android

```sh
# Build the web app
npm run build

# Sync the build to the Android project
npx cap sync android

# Open the project in Android Studio
npx cap open android

# Run on emulator
npx cap run android

# For a specific device/emulator
npx cap run android --target="Pixel_5_API_31"

# Build APK for testing
cd android
./gradlew assembleDebug

# Build AAB for Play Store
./gradlew bundleRelease
```

## User Workflows

### 1. Medication Management
1. Navigate to "My Medications"
2. Click "Add New" to create a new medication entry
3. Enter medication details including name, dosage, and schedule
4. Save the medication to your profile
5. Receive reminders based on your configured schedule

### 2. Pill Identification
1. Navigate to "Identify Pill"
2. Either:
   - Enter text description of the pill
   - Upload an image of the pill
3. Review the identification results
4. Add the identified medication to your list if needed

### 3. Reminders & Scheduling
1. View all upcoming medication times in the Reminders section
2. Mark medications as taken when complete
3. Manage appointment schedule in the Calendar view
4. Set up voice reminders for more accessible notifications

## Development Roadmap

### Completed
- ✅ Core medication management functionality
- ✅ Basic pill identification using RxNav API
- ✅ Reminders interface
- ✅ Video chat mockup
- ✅ User authentication
- ✅ Supabase database integration
- ✅ Activity logging

### In Progress
- 🔄 Enhanced pill identification with image analysis
- 🔄 Medication interaction checker
- 🔄 Health metrics dashboard

### Planned (Future Iterations)
- 📅 Mobile app versions (iOS/Android)
- 📅 Voice assistant integration
- 📅 Pharmacy integration for automatic refills
- 📅 Wearable device synchronization
- 📅 AI-powered health insights
- 📅 Support for multiple languages

## Contributing

We welcome contributions to MediHelper! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## Privacy & Security

MediHelper takes user privacy and data security seriously:

- All personal health information is encrypted
- Authentication is handled through secure providers
- No health data is shared with third parties without explicit consent
- Regular security audits are conducted
- HIPAA compliance guidelines are followed (in applicable regions)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- RxNav API for medication data
- NIH for health information resources
- Supabase for backend infrastructure
- shadcn/ui for component library
- All contributors and beta testers

## Support

For help or questions, please:
- Open an issue in the GitHub repository
- Contact our support team at support@medihelper.com
