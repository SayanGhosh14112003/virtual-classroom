// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCppG0JOZazORnijgiLGVF5vSF2c-2V_KQ",
  authDomain: "fir-learning-33c77.firebaseapp.com",
  databaseURL: "https://fir-learning-33c77-default-rtdb.firebaseio.com",
  projectId: "fir-learning-33c77",
  storageBucket: "fir-learning-33c77.appspot.com",
  messagingSenderId: "480491230947",
  appId: "1:480491230947:web:9648072aa228bd492497d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;