import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  collectionData,
  docData,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  // 🔍 Obtener usuario por ID
  getUserById(id: string): Observable<User | undefined> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>;
  }

  // ➕ Crear nuevo usuario (ID generado automáticamente)
  createUserWithId(uid: string, userData: Omit<User, 'id'>): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userRef, userData);
  }

  // ✏️ Actualizar usuario existente
  updateUser(id: string, user: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, user);
  }

  // 🧾 Listar todos los usuarios
  getAllUsers(): Observable<(User & { id: string })[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<(User & { id: string })[]>;
  }
}
