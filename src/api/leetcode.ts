import jwtDecode from 'jwt-decode';
import firebase from './firebase';
import { where, query, getDocs, collection } from 'firebase/firestore';

class LeetCodeSingleton {
  private static instance: LeetCodeSingleton;
  private decoded: any;

  private constructor(sessionCookie: string) {
    this.decoded = jwtDecode(sessionCookie);
  }

  public static getInstance(sessionCookie: string): LeetCodeSingleton {
    if (!LeetCodeSingleton.instance) {
      LeetCodeSingleton.instance = new LeetCodeSingleton(sessionCookie);
    }

    return LeetCodeSingleton.instance;
  }

  public getUserName() {
    return this.decoded.username;
  }

  public async getProblemStatus(problemName: string) {
    const statusRef = collection(firebase.getDb(), 'status');
    const q = query(statusRef, where('problem', '==', problemName));
    const querySnapshot = await getDocs(q);

    let status = null;
    querySnapshot.forEach((doc) => {
      status = doc.data();
    });

    return status?.status;
  }
}

export default LeetCodeSingleton;