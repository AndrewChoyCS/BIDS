// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";

import 'firebase/auth';

import Constants from 'expo-constants';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIt3E2OkFlypJTWt-QD2n2ZVpGMidaLHI",
  authDomain: "bids-408802.firebaseapp.com",
  projectId: "bids-408802",
  storageBucket: "bids-408802.appspot.com",
  messagingSenderId: "844198488623",
  appId: "1:844198488623:web:da77d03320fa9db39ff4da",
  measurementId: "G-DSQNTXNYGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
const db = getDatabase();
const storage = getStorage();


export {db, storage}
