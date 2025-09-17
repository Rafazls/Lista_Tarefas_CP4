import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOEQT_w1A1M5NqV3w-AtvYXriuvr0VTA4",
  authDomain: "lista-tarefas-plus-22b31.firebaseapp.com",
  projectId: "lista-tarefas-plus-22b31",
  storageBucket: "lista-tarefas-plus-22b31.firebasestorage.app",
  messagingSenderId: "877104674527",
  appId: "1:877104674527:web:54bd64113ff00d3de99b6a"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };