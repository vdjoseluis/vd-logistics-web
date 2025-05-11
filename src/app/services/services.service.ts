import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';
import { Storage, getDownloadURL, listAll, ref } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

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

  getServiceById(id: string): Observable<any> {
    const docRef = doc(this.firestore, `services/${id}`);
    return from(getDoc(docRef)).pipe(
      switchMap((serviceSnap) => {
        if (!serviceSnap.exists()) {
          return of(null);
        }

        const serviceData = serviceSnap.data() as any;

        return from(Promise.all([
          serviceData.refCustomer ? getDoc(serviceData.refCustomer) : Promise.resolve(null),
          serviceData.refOperator ? getDoc(serviceData.refOperator) : Promise.resolve(null),
          this.getFiles(`services/${id}/resources`),
          this.getFiles(`services/${id}/byOperator`)
        ])).pipe(
          map(([customerSnap, operatorSnap, resourcesFiles, operatorFiles]) => {
            const customerData = customerSnap?.data() as Customer;
            const operatorData = operatorSnap?.data() as User;

            return {
              id: serviceSnap.id,
              date: serviceData.date.toDate(),
              time: new Date(serviceData.date.toDate().setSeconds(0, 0)),
              status: serviceData.status,
              description: serviceData.description,
              user: operatorData ? `${operatorData.firstName} ${operatorData.lastName}` : 'Desconocido',
              type: serviceData.type,
              customer: customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Desconocido',
              comments: serviceData.comments || '',
              sharedFiles: resourcesFiles,
              operatorFiles: operatorFiles
            };
          })
        );
      })
    );
  }
  private async getFiles(path: string): Promise<string[]> {
    const storageRef = ref(this.storage, path);
    const filesSnapshot = await listAll(storageRef);
    return await Promise.all(filesSnapshot.items.map(fileRef => getDownloadURL(fileRef)));
  }
}
