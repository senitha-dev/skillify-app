import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillify.app',
  appName: 'Skillify',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
