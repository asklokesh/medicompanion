
# MediCompanion Deployment Instructions

This document provides comprehensive instructions for deploying the MediCompanion application to both the Apple App Store and Google Play Store. Follow these step-by-step guidelines to successfully publish your app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Preparing for Deployment](#preparing-for-deployment)
3. [iOS App Store Deployment](#ios-app-store-deployment)
4. [Google Play Store Deployment](#google-play-store-deployment)
5. [Testing Before Submission](#testing-before-submission)
6. [Post-Deployment Monitoring](#post-deployment-monitoring)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Apple App Store
- Apple Developer Program membership ($99/year)
- macOS computer with Xcode 14 or later
- Apple ID with two-factor authentication
- App-specific password for your Apple ID

### Google Play Store
- Google Play Developer account ($25 one-time fee)
- Keystore file for app signing
- Privacy policy URL
- High-resolution app icon (512x512 px)
- Feature graphic (1024x500 px)

### General
- Node.js 16 or later
- npm or yarn
- Git
- Capacitor CLI (`npm install -g @capacitor/cli`)

## Preparing for Deployment

### 1. Update App Version

In your project root, update the version in `package.json`:

```json
{
  "name": "medicompanion",
  "version": "1.0.0",
  ...
}
```

### 2. Prepare App Assets

#### iOS Requirements
- App Icon (various sizes, generated in Xcode)
- App screenshots (6.5" iPhone, 12.9" iPad)
- App preview video (optional)
- Privacy policy URL

#### Android Requirements
- App Icon (adaptive icon with foreground and background layers)
- Feature graphic (1024x500 px)
- Screenshots (phone and tablet)
- Privacy policy URL
- Short description (80 characters max)
- Full description (4000 characters max)

### 3. Build the Web Application

```bash
# Clean build directory
rm -rf dist

# Build the app
npm run build
```

## iOS App Store Deployment

### 1. Configure iOS Project

```bash
# Sync web build with iOS
npx cap sync ios

# Open Xcode project
npx cap open ios
```

### 2. Xcode Configuration

1. In Xcode, select the project navigator and select the project
2. Select the "App" target and go to the "General" tab
3. Update the following:
   - Display name
   - Bundle identifier (com.yourcompany.medicompanion)
   - Version (e.g., 1.0.0)
   - Build (e.g., 1)
   - Deployment target (iOS 14.0 or higher recommended)
   - Device orientation
   - App icons
   - Launch screen

4. Go to "Signing & Capabilities"
   - Ensure "Automatically manage signing" is checked
   - Select your development team
   - Verify provisioning profile is created automatically

### 3. Create App in App Store Connect

1. Visit [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to "My Apps" and click the "+" button
3. Select "New App" and fill out the required information:
   - Platform: iOS
   - App name
   - Primary language
   - Bundle ID (must match Xcode)
   - SKU (unique identifier for your records)
   - User access (full access recommended)

### 4. App Store Information

In App Store Connect, complete the following sections:
- App information
- Pricing and availability
- App privacy
- App rating
- Version information including:
  - Screenshots
  - App preview videos (optional)
  - Description
  - Keywords
  - Support URL
  - Marketing URL (optional)
  - Build (uploaded from Xcode)

### 5. Upload Build to App Store Connect

1. In Xcode, select "Product" > "Archive"
2. When archiving completes, click "Distribute App"
3. Select "App Store Connect" and click "Next"
4. Choose distribution options (typically default options are fine)
5. Sign the app with your distribution certificate
6. Click "Upload" to send the build to App Store Connect

### 6. Submit for Review

1. In App Store Connect, select your app and version
2. Confirm all required information is complete
3. Click "Submit for Review"

## Google Play Store Deployment

### 1. Configure Android Project

```bash
# Sync web build with Android
npx cap sync android

# Open Android Studio project
npx cap open android
```

### 2. Android Studio Configuration

1. In Android Studio, open `android/app/build.gradle`
2. Update the following:
   - applicationId (e.g., "app.medicompanion.app")
   - versionCode (integer, increment for each update)
   - versionName (e.g., "1.0.0")
   - minSdkVersion (recommend 21 or higher)
   - targetSdkVersion and compileSdkVersion (recommend latest stable)

3. Update app name in `android/app/src/main/res/values/strings.xml`

### 3. Generate Signed APK/Bundle

1. In Android Studio, select "Build" > "Generate Signed Bundle/APK"
2. Select "Android App Bundle" (recommended) or "APK"
3. Create a new keystore or use an existing one:
   - Store location (keep this secure!)
   - Password
   - Alias
   - Alias password
4. Select release build variant
5. Click "Finish" to generate the AAB/APK

### 4. Create App in Google Play Console

1. Visit [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in the required information:
   - App name
   - Default language
   - App type (Application)
   - Free or paid
   - Declarations

### 5. Play Store Listing

Complete the following sections:
- App details
- Contact details
- Privacy policy
- Store listing:
  - Short description
  - Full description
  - Screenshots
  - Feature graphic
  - App icon
  - Content rating (complete questionnaire)
  - Target audience
  - Set up pricing and distribution

### 6. Upload App Bundle/APK

1. In Google Play Console, navigate to "Release" > "Production"
2. Click "Create new release"
3. Upload the AAB/APK file generated from Android Studio
4. Add release notes
5. Review the release

### 7. Submit for Review

1. Complete the app content rating questionnaire
2. Ensure all store listing information is complete
3. Click "Start rollout to Production"

## Testing Before Submission

### iOS Testing

1. **TestFlight Internal Testing**:
   - In App Store Connect, go to "TestFlight" > "Internal Testing"
   - Add internal testers (up to 25 Apple IDs)
   - Upload a build
   - Internal testers will receive an email to test

2. **TestFlight External Testing**:
   - In TestFlight, go to "External Testing"
   - Create a group
   - Add email addresses or create a public link
   - Submit for review (usually quick for external testing)
   - Once approved, invite external testers

### Android Testing

1. **Internal Testing**:
   - In Google Play Console, go to "Testing" > "Internal testing"
   - Create a new release
   - Upload your AAB/APK
   - Add testers by email or create a closed testing URL
   - Testers must opt-in via the link

2. **Closed Testing**:
   - Similar to internal testing but with a larger group
   - Requires a short review before testers can access

3. **Open Testing**:
   - Makes your app available to anyone who has the opt-in URL
   - Good for wider beta testing

## Post-Deployment Monitoring

### App Analytics

1. **App Store Connect Analytics**:
   - Usage
   - Sales
   - Crashes
   - User retention

2. **Google Play Console Analytics**:
   - User acquisition
   - User engagement
   - Stability metrics
   - Revenue metrics

### Crash Reporting

- Consider integrating a crash reporting tool like Firebase Crashlytics

### User Feedback Management

- Monitor and respond to App Store and Play Store reviews
- Set up a feedback channel within the app

## Troubleshooting

### Common iOS Submission Issues

1. **Missing Information**:
   - Ensure all required fields in App Store Connect are complete
   - Verify privacy policy is accessible and GDPR compliant

2. **Rejection Reasons**:
   - Crashes or bugs
   - Incomplete metadata
   - Privacy concerns
   - Poor user interface

### Common Android Submission Issues

1. **Metadata Issues**:
   - Missing or incomplete store listing
   - Inappropriate content in screenshots

2. **Technical Issues**:
   - App crashes
   - Performance problems
   - Permission issues
   - Target API level not meeting requirements

### Resolution Steps

1. Read rejection feedback carefully
2. Fix all mentioned issues
3. Test thoroughly before resubmitting
4. If unclear, contact App Store or Play Store support

## Additional Resources

### iOS Resources
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

### Android Resources
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Android Developer Guidelines](https://developer.android.com/distribute/best-practices/launch)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

### Capacitor Resources
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Deployment Guide](https://capacitorjs.com/docs/ios/deploying-to-app-store)
- [Android Deployment Guide](https://capacitorjs.com/docs/android/deploying-to-google-play)
