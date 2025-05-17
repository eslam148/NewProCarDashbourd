export const environment = {
  production: false,
  apiUrl: 'https://procare.runasp.net',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'ar'],
  appName: 'CoreUI Admin',
  version: '1.0.0',
  // Add other environment-specific variables here
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  },
  // Add any other configuration variables your app needs
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableChat: false
  }
};
