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
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable, from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private db = inject(Firestore);
  private usersCollection = collection(this.db, 'users');

  // 🔍 Obtener usuario por ID
  getUserById(id: string): Observable<User | undefined> {
    const userDocRef = doc(this.db, `users/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>;
  }

  // ➕ Crear nuevo usuario (ID generado automáticamente)
  createUserWithId(uid: string, userData: Omit<User, 'id'>): Promise<void> {
    const userRef = doc(this.db, `users/${uid}`);
    return setDoc(userRef, userData);
  }

  // ✏️ Actualizar usuario existente
  updateUser(id: string, user: Partial<User>): Promise<void> {
    const userDocRef = doc(this.db, `users/${id}`);
    return updateDoc(userDocRef, user);
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
}
