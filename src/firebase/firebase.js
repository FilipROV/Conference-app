import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDwCqOODX5DA_nLmGYCY3qeM3KyAUGEzjw",
  authDomain: "conference-app-f2d90.firebaseapp.com",
  projectId: "conference-app-f2d90",
  storageBucket: "conference-app-f2d90.appspot.com",
  messagingSenderId: "299194004366",
  appId: "1:299194004366:web:0c80c495d6ff9626d06adf"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {
    db,
    auth
}