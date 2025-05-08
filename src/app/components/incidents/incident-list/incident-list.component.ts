import { Component, inject, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { Customer } from '../../../models/customer.model';
import { Incident } from '../../../models/incident.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { IncidentsService } from '../../../services/incidents.service';

type ExtendedIncident = Incident & {
  id: string,
  dateFormatted: string,
  operatorName: DocumentReference<User>,
  customerName: DocumentReference<Customer>
};

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './incident-list.component.html',
})
export default class IncidentListComponent implements OnInit {
  private incidentsService = inject(IncidentsService);
  incidents: ExtendedIncident[] = [];
  currentPage = 1;
  isLoading = true;

  ngOnInit() {
    this.incidentsService.getIncidents().subscribe(data => {
      this.incidents = data;
      this.isLoading = false;
    });
  }
}
