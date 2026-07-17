import AsyncStorage from '@react-native-async-storage/async-storage';

// redux-persist's storage engine touches `window` (via AsyncStorage's web
// implementation) as soon as it's used. Expo Router's web output renders an
// initial pass on the server, where `window` doesn't exist, so fall back to
// a no-op storage there and let the client take over after hydration.
const noopStorage = {
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
};

const storage = typeof window === 'undefined' ? noopStorage : AsyncStorage;

export default storage;
