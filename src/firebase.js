import firebase from "firebase";
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCuIk-25xBB7rNFEODmOOT3NhtaP8z9Jg8",
  authDomain: "crudfirebase-23ac7.firebaseapp.com",
  projectId: "crudfirebase-23ac7",
  storageBucket: "crudfirebase-23ac7.appspot.com",
  messagingSenderId: "66185419244",
  appId: "1:66185419244:web:2176088c4ddcf2177cc8c9",
  measurementId: "G-M3H6HE9628"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export {firebase};