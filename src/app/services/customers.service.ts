import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private db = inject(Firestore);

  getAllCustomers(): Observable<(Customer & {id:string})[]> {
    const customersRef = collection(this.db, 'customers');
    return collectionData(customersRef, { idField: 'id' }) as Observable<(Customer & { id: string })[]>;
  }
}
