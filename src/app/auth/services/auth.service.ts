import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, getAuth } from '@angular/fire/auth';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  createUser(userData: Partial<User>, password: string) {
    return this.http.post<{ uid: string }>(`${this.apiUrl}/createUser`, { userData, password });
  }

  updateUser(uid: string, userData: Partial<User>) {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/updateUser/${uid}`, { userData });
  }

  deleteUser(uid: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/deleteUser/${uid}`);
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(getAuth(), email, password);
  }

  async logout(): Promise<void> {
    await signOut(getAuth());
  }

  getCurrentUserId(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null;
  }

  getUser(uid: string) {
    return this.http.get<User>(`${this.apiUrl}/getUser/${uid}`);
  }
}
