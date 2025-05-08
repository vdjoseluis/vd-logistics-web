import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, getDoc } from '@angular/fire/firestore';
import { Observable, from, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class LogsService {
  private firestore = inject(Firestore);

  getLogs(): Observable<any[]> {
    const colRef = collection(this.firestore, 'logs');
    return collectionData(colRef, { idField: 'id' }).pipe(
      switchMap((logs: any[]) => {
        const logsWithRefs$ = logs.map(async (log) => {
          const operatorSnap = await getDoc(log.refOperator);
          const operatorData = operatorSnap.data() as User;

          const serviceSnap = await getDoc(log.refService);
          const serviceData = serviceSnap.data() as Service;

          return {
            id: log.id,
            dateFormatted: log.date.toDate().toLocaleDateString(),
            action: log.action,
            operatorName: operatorData ? `${operatorData.firstName} ${operatorData.lastName}` : 'Desconocido',
            serviceId: serviceSnap ? serviceSnap.id : 'Desconocido',
          };
        })
        return from(Promise.all(logsWithRefs$));
      })
    );
  }
}
