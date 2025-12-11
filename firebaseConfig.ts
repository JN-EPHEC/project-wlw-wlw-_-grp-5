import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDytPFQiWXBfoVFKuv_njTkpWPIPpFIbEI',
  authDomain: 'mindly-70d11.firebaseapp.com',
  projectId: 'mindly-70d11',
  storageBucket: 'mindly-70d11.firebasestorage.app',
  messagingSenderId: '289521181127',
  appId: '1:289521181127:web:b2b0539aa4625b21fb39e2',
};

const app = initializeApp(firebaseConfig);

let authInstance;
try {
  // Chargement paresseux pour éviter l'échec si le module n'est pas installé.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
