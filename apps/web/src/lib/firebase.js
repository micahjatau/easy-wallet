import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_CONFIG, isFirebaseConfigured } from '../config/firebase.js'

const createFirebaseApp = () => {
  if (!isFirebaseConfigured()) {
    return null
  }

  return getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
}

export const firebaseApp = createFirebaseApp()
export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null

export const handleFirebaseError = (error) => {
  return {
    error: error?.message || 'Unknown Firebase error',
    code: error?.code,
    details: error?.details,
  }
}
