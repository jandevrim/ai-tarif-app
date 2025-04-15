// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8rThu4ryzECrclhzmdRLqAKQsQbdZg2k",
  authDomain: "thermochefai.firebaseapp.com",
  projectId: "thermochefai",
  storageBucket: "thermochefai.firebasestorage.app",
  messagingSenderId: "341786502303",
  appId: "1:341786502303:web:55f2bc04ded268d15eeeaa",
  measurementId: "G-FK1QL4HS5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);