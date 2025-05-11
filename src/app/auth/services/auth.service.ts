import { inject, Injectable, } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, getDoc, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async getCurrentUserProfile() {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(userDoc);
    return snap.exists() ? snap.data() : null;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout() {
    return signOut(this.auth);
  }

  getUserState(): Promise<boolean> {
    return new Promise(resolve => {
      const unsub = onAuthStateChanged(this.auth, user => {
        unsub();
        resolve(!!user);
      });
    });
  }

  createUserAuth(email: string, password: string): Promise<string> {
    return createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      return userCredential.user.uid;
    });
  }
}
