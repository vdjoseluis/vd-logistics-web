import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { Service } from '../models/service.model';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private firestore = inject(Firestore);

  getIncidents(status: string): Observable<any[]> {
    const colRef = collection(this.firestore, 'incidents');

    return collectionData(colRef, { idField: 'id' }).pipe(
      switchMap((incidents: any[]) => {
        const filtered = incidents.filter(incident => incident.status === status).sort((a, b) => a.date.toMillis() - b.date.toMillis());

        const incidentsWithRefs$ = filtered.map(async (incident) => {
          const serviceSnap = await getDoc(incident.refService);
          const operatorSnap = await getDoc(incident.refOperator);

          const serviceData = serviceSnap.data() as Service;
          const operatorData = operatorSnap.data() as User;

          let customerData: Customer | null = null;

          if (serviceData?.refCustomer) {
            const customerSnap = await getDoc(serviceData.refCustomer);
            customerData = customerSnap.exists() ? customerSnap.data() as Customer : null;
          }

          const customerName = customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Desconocido';

          return {
            id: incident.id,
            dateFormatted: incident.date.toDate().toLocaleDateString(),
            operatorName: operatorData ? `${operatorData.firstName} ${operatorData.lastName}` : 'Desconocido',
            customerName: customerName,
            description: incident.description,
          };
        });

        return from(Promise.all(incidentsWithRefs$));
      })
    );
  }

  getIncidentById(id: string): Observable<any> {
  const docRef = doc(this.firestore, `incidents/${id}`);
  return from(getDoc(docRef)).pipe(
    switchMap((incidentSnap) => {
      if (!incidentSnap.exists()) {
        return of(null);
      }

      const incidentData = incidentSnap.data() as any;

      return from(Promise.all([
        incidentData.refService ? Promise.resolve(incidentData.refService.id) : Promise.resolve(null),
        incidentData.refOperator ? getDoc(incidentData.refOperator) : Promise.resolve(null),
      ])).pipe(
        map(([serviceId, operatorSnap]) => {
          const operatorData = operatorSnap?.data() as User;

          return {
            id: incidentSnap.id,
            date: incidentData.date.toDate().toLocaleDateString(),
            time: new Date(incidentData.date.toDate()).toLocaleTimeString(),
            description: incidentData.description,
            user: operatorData ? `${operatorData.firstName} ${operatorData.lastName}` : 'Desconocido',
            service: serviceId ?? 'Desconocido', 
          };
        })
      );
    })
  );
}

}
