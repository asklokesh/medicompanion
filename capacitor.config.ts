
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0d0827cd5ea04fb7bc8d056d1dcfcf69',
  appName: 'medicompanion',
  webDir: 'dist',
  server: {
    url: 'https://0d0827cd-5ea0-4fb7-bc8d-056d1dcfcf69.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    contentInset: 'always',
  }
};

export default config;
