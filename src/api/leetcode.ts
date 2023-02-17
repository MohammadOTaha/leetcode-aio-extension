import jwtDecode from 'jwt-decode';
import firebase from './firebase';
import { collection, getDocs, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore';

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
    const q = query(
      statusRef,
      where('problem', '==', problemName),
      where('user', '==', this.getUserName())
    );
    const querySnapshot = await getDocs(q);

    let status = null;
    querySnapshot.forEach((doc) => {
      status = doc.data();
    });

    if (!status) {
      return 'default';
    }

    return status.status;
  }

  public async setProblemStatus(problemName: string, status: string) {
    const statusRef = collection(firebase.getDb(), 'status');
    const q = query(
      statusRef,
      where('problem', '==', problemName),
      where('user', '==', this.getUserName())
    );
    const querySnapshot = await getDocs(q);

    let statusDoc = null;
    querySnapshot.forEach((doc) => {
      statusDoc = doc;
    });

    if (statusDoc) {
      await setDoc(statusDoc.ref, {
        problem: problemName,
        user: this.getUserName(),
        status
      });
    } else {
      await addDoc(statusRef, {
        problem: problemName,
        user: this.getUserName(),
        status
      });
    }

    return true;
  }

  public async getProblemReminder(problemName: string) {
    const reminderRef = collection(firebase.getDb(), 'reminder');
    const q = query(
      reminderRef,
      where('problem', '==', problemName),
      where('user', '==', this.getUserName())
    );
    const querySnapshot = await getDocs(q);

    let reminder = null;
    querySnapshot.forEach((doc) => {
      reminder = doc.data();
    });

    return reminder?.dateTime;
  }

  public async setProblemReminder(problemName: string, dateTime: Date) {
    const reminderRef = collection(firebase.getDb(), 'reminder');
    const q = query(
      reminderRef,
      where('problem', '==', problemName),
      where('user', '==', this.getUserName())
    );
    const querySnapshot = await getDocs(q);

    let reminderDoc = null;
    querySnapshot.forEach((doc) => {
      reminderDoc = doc;
    });

    if (reminderDoc) {
      await setDoc(reminderDoc.ref, {
        problem: problemName,
        user: this.getUserName(),
        dateTime
      });
    } else {
      await addDoc(reminderRef, {
        problem: problemName,
        user: this.getUserName(),
        dateTime
      });
    }

    return true;
  }

  public async clearProblemReminder(problemName: string) {
    const reminderRef = collection(firebase.getDb(), 'reminder');
    const q = query(
      reminderRef,
      where('problem', '==', problemName),
      where('user', '==', this.getUserName())
    );
    const querySnapshot = await getDocs(q);

    let reminderDoc = null;
    querySnapshot.forEach((doc) => {
      reminderDoc = doc;
    });

    if (reminderDoc) {
      await deleteDoc(reminderDoc.ref);
    }

    return true;
  }
}

export default LeetCodeSingleton;