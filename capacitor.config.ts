
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.medicompanion.app',
  appName: 'MediCompanion',
  webDir: 'dist',
  server: {
    // Comment out this section to use bundled assets instead of loading from URL
    // url: 'https://0d0827cd-5ea0-4fb7-bc8d-056d1dcfcf69.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    // These settings make it feel more like a native app
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    allowsLinkPreview: false
  },
  android: {
    contentInset: 'always',
    // Additional Android settings
    backgroundColor: '#ffffff',
    allowsLinkPreview: false
  },
  plugins: {
    // Make the app feel more native by disabling browser features
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff"
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
