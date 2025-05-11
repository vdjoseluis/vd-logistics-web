import { inject, Injectable } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { collection, doc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private db = inject(Firestore);
  private customersCollection = collection(this.db, 'customers');

  getAllCustomers(): Observable<(Customer & {id:string})[]> {
    const customersRef = collection(this.db, 'customers');
    return collectionData(customersRef, { idField: 'id' }) as Observable<(Customer & { id: string })[]>;
  }

  // 🔍 Obtener cliente por ID
    getCustomerById(id: string): Observable<Customer | undefined> {
      const customerDocRef = doc(this.db, `customers/${id}`);
      return docData(customerDocRef, { idField: 'id' }) as Observable<Customer>;
    }

    // ➕ Crear nuevo cliente (ID generado automáticamente)
    createCustomer(customerData: Omit<Customer, 'id'>): Promise<void> {
      const customerRef = doc(this.db, 'customers');
      return setDoc(customerRef, customerData);
    }

    // ✏️ Actualizar cliente existente
    updateCustomer(id: string, customer: Partial<Customer>): Promise<void> {
      const customerDocRef = doc(this.db, `customers/${id}`);
      return updateDoc(customerDocRef, customer);
    }

    docRef = (id: string) => doc(this.db, `customers/${id}`)

}
