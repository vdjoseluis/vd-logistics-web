import { Component, inject, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { Customer } from '../../../models/customer.model';
import { Incident } from '../../../models/incident.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { IncidentsService } from '../../../services/incidents.service';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

type ExtendedIncident = Incident & {
  id: string,
  dateFormatted: string,
  operatorName: DocumentReference<User>,
  customerName: DocumentReference<Customer>
};

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterModule, MatTabsModule],
  templateUrl: './incident-list.component.html',
})
export default class IncidentListComponent implements OnInit {
  private incidentsService = inject(IncidentsService);
  incidents: ExtendedIncident[] = [];
  statusTabs = [
    { label: 'Pendientes', status: 'Pendiente' },
    { label: 'Tramitadas', status: 'Tramitada' },
  ];

  activeTabIndex = 0;
  isLoading = true;
  currentPage = 1;

  ngOnInit(): void {
    this.loadIncidentsForCurrentTab();
  }

  loadIncidentsForCurrentTab() {
    this.isLoading = true;
    const currentStatus = this.statusTabs[this.activeTabIndex].status;

    this.incidentsService.getIncidents(currentStatus).subscribe((data) => {
      this.incidents = data;
      this.isLoading = false;
      this.currentPage = 1;
    });
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.loadIncidentsForCurrentTab();
  }
}
