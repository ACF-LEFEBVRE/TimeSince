// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFirestore as initFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC60fPbg5Jfs2ApgcuODmLwVOPHtyVKYTQ',
  authDomain: 'time-since-d891c.firebaseapp.com',
  projectId: 'time-since-d891c',
  storageBucket: 'time-since-d891c.appspot.com', // Corregido el bucket name
  messagingSenderId: '830499648646',
  appId: '1:830499648646:web:d4b4f0e0bb36a0e0fe8d07',
  measurementId: 'G-R8QFPX7CD7',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const auth = getAuth(app)
const db = initFirestore(app)

export { app, auth, db }
export default app
