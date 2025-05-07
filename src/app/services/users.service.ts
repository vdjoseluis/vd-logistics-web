import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private db = inject(Firestore);

  getAllUsers(): Observable<(User & {id:string})[]> {
    const usersRef = collection(this.db, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<(User & { id: string })[]>;
  }
}
