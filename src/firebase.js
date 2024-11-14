import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDiNxxFIVgOVorQxc1Jr_1vbPV5qpuWaB4",
    authDomain: "project-6405354224770202250.firebaseapp.com",
    projectId: "project-6405354224770202250",
    storageBucket: "project-6405354224770202250.firebasestorage.app",
    messagingSenderId: "891019215391",
    appId: "1:891019215391:web:e35c1d2a9d4ba2c2468b2a",
    measurementId: "G-TY1ET6WWT0"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 