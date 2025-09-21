// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGWUU8Myi-J4CDAFTvzV4VkL2r52PScDI",
  authDomain: "authdeneme-d8ca1.firebaseapp.com",
  projectId: "authdeneme-d8ca1",
  storageBucket: "authdeneme-d8ca1.firebasestorage.app",
  messagingSenderId: "406929762828",
  appId: "1:406929762828:web:59790b100044bd14095c29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);