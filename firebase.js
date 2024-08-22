// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpfJ2t9UixYWWQznV8kchiO_YTZwaaa6E",
  authDomain: "adhdtm-cfe70.firebaseapp.com",
  projectId: "adhdtm-cfe70",
  storageBucket: "adhdtm-cfe70.appspot.com",
  messagingSenderId: "855562342052",
  appId: "1:855562342052:web:de5d5d83297bac6917a031",
  measurementId: "G-1ZSYMDB1BZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


const firestore = getFirestore(app);

export { auth, firestore };
