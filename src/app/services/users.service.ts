import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  collectionData,
  docData,
  query,
  where,
  deleteDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private db = inject(Firestore);

  // 🔍 Obtener usuario por ID
  getUserById(id: string): Observable<User | undefined> {
    const userDocRef = doc(this.db, `users/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>;
  }

  // ➕ Crear nuevo usuario (ID generado automáticamente)
  async createUserWithId(uid: string, user: any): Promise<void> {
    await setDoc(doc(this.db, `users/${uid}`), user);
  }

  // ✏️ Actualizar usuario existente
  async updateUser(uid: string, userData: Partial<User>): Promise<void> {
    await updateDoc(doc(this.db, `users/${uid}`), userData);
  }

  // 🧾 Listar todos los usuarios
  getAllUsers(): Observable<(User & { id: string })[]> {
    const usersRef = collection(this.db, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<(User & { id: string })[]>;
  }

  getUsersByType(type: string) {
    const usersRef = collection(this.db, 'users');
    const q = query(usersRef, where('type', '==', type));
    return collectionData(q, { idField: 'id' }) as Observable<(User & { id: string })[]>;
  }

  docRef = (id: string) => doc(this.db, `users/${id}`);

  async deleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(this.db, `users/${uid}`));
  }
}
