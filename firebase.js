// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ1QubYsTfRL_A4XSQql2co_Lezgn_Fr0",
  authDomain: "namma-madurai1.firebaseapp.com",
  databaseURL: "https://namma-madurai1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "namma-madurai1",
  storageBucket: "namma-madurai1.firebasestorage.app",
  messagingSenderId: "574250969396",
  appId: "1:574250969396:web:68597b23cfa13ab1a15d61",
  measurementId: "G-NNGZ5MJ199"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, database, googleProvider };