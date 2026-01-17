import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAs-PLACEHOLDER-KEY",
  authDomain: "psi-ux-hub.firebaseapp.com",
  projectId: "psi-ux-hub",
  storageBucket: "psi-ux-hub.appspot.com",
  messagingSenderId: "384756291038",
  appId: "1:384756291038:web:7f6d5e4d3c2b1a0f9e8d7c"
};

export const psiApp = getApps().length === 0 ? initializeApp(firebaseConfig, 'psiApp') : getApp('psiApp');
export const storage = getStorage(psiApp);
export const db = getFirestore(psiApp);

export default psiApp;