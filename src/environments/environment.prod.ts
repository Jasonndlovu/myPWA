import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
export const environment = {
  production: true,

  firebaseConfig: {
    apiKey: "AIzaSyAcWgXGrgyfcdwg65h7VeSYwHr8pAKn09Y",
    authDomain: "mypwa-1e7f2.firebaseapp.com",
    projectId: "mypwa-1e7f2",
    storageBucket: "mypwa-1e7f2.firebasestorage.app",
    messagingSenderId: "416258581246",
    appId: "1:416258581246:web:c59cc09dfe5265ed01fbaf",
    measurementId: "G-V75351LVZZ"
  }



};
const app = initializeApp(environment.firebaseConfig);
export const db = getFirestore(app);