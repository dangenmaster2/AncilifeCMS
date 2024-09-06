import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAyGmyNIwOxPWKmUNnqv8BqmacrBvXK_So",
  authDomain: "ancilife-151f6.firebaseapp.com",
  databaseURL: "https://ancilife-151f6-default-rtdb.firebaseio.com",
  projectId: "ancilife-151f6",
  storageBucket: "ancilife-151f6.appspot.com",
  messagingSenderId: "745131209241",
  appId: "1:745131209241:web:af37fb8f9f9759b5243088"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const fireDb=getFirestore(app);
const storage=getStorage(app);
const database = getDatabase()

export { fireDb, auth, storage }