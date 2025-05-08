import { Injectable, inject } from '@angular/core';
import { DocumentReference, Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private firestore = inject(Firestore);

  getServices(status: string): Observable<any[]> {
    const colRef = collection(this.firestore, 'services');
    return collectionData(colRef, { idField: 'id' }).pipe(
      switchMap((services: any[]) => {
        const filtered = services.filter(s => s.status === status).sort((a, b) => a.date.toMillis() - b.date.toMillis());

        const servicesWithRefs$ = filtered.map(async (s) => {
          const customerSnap = await getDoc(s.refCustomer);
          const operatorSnap = await getDoc(s.refOperator);

          const customerData = customerSnap.data() as Customer;
          const operatorData = operatorSnap.data() as User;

          return {
            id: s.id,
            dateFormatted: s.date.toDate().toLocaleDateString(),
            operatorName: operatorData ? `${operatorData.firstName} ${operatorData.lastName}` : 'Desconocido',
            type: s.type,
            customerName: customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Desconocido',
            city: customerData ? customerData.city : 'Desconocida',
          };
        });

        return from(Promise.all(servicesWithRefs$));
      })
    );
  }
}
