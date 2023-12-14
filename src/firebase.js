import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyAtCkG161WrzMvleCcdN9557ECWKP_f7c4",
    authDomain: "zpo2-8ff94.firebaseapp.com",
    databaseURL: "https://zpo2-8ff94-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zpo2-8ff94",
    storageBucket: "zpo2-8ff94.appspot.com",
    messagingSenderId: "137846504274",
    appId: "1:137846504274:web:c310a98faa3155592f988b",
    measurementId: "G-5YM9DGL8YQ"
};
// Inicjalizacja aplikacji Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);
const firestoreDb = getFirestore(app);

export { app, auth, storage, db , firestoreDb};