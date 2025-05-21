import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private db = inject(Firestore);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000';

  // 🔍 Obtener todos los clientes desde el backend
  getAllCustomers(): Observable<Partial<Customer>[]> {
    const customersRef = collection(this.db, 'customers');
    return collectionData(customersRef, { idField: 'id' }) as Observable<Partial<Customer>[]>;
  }

  // 🔍 Obtener cliente por ID desde el backend
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/getCustomer/${id}`);
  }

  // ➕ Crear nuevo cliente en el backend
  createCustomer(customerData: Omit<Customer, 'id'>): Observable<{ success: boolean; id: string }> {
    return this.http.post<{ success: boolean; id: string }>(`${this.apiUrl}/createCustomer`, {
      ...customerData
    });
  }

  // ✏️ Actualizar cliente existente en el backend
  updateCustomer(id: string, customerData: Partial<Customer>): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/updateCustomer/${id}`, {
      ...customerData
    });
  }

  // 🗑️ Eliminar cliente en el backend
  deleteCustomer(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/deleteCustomer/${id}`);
  }
}
