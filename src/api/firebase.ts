import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

class FirebaseSingleton {
  private static instance: FirebaseSingleton;
  private readonly db: any;
  private readonly auth: any;

  private constructor() {
    const firebase = initializeApp(firebaseConfig);

    this.db = getFirestore(firebase);
    this.auth = getAuth(firebase);
  }

  public static getInstance(): FirebaseSingleton {
    if (!FirebaseSingleton.instance) {
      FirebaseSingleton.instance = new FirebaseSingleton();
    }

    return FirebaseSingleton.instance;
  }

  public getDb() {
    return this.db;
  }

  public getAuth() {
    return this.auth;
  }
}

export default FirebaseSingleton.getInstance();
