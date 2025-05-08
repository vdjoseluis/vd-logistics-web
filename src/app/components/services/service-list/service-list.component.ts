import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ServicesService } from '../../../services/services.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Service } from '../../../models/service.model';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

type ExtendedService = Service & {
  id: string;
  dateFormatted: string;
  operatorName: string;
  customerName: string;
  city: string;
};

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, MatTabsModule, RouterModule],
  templateUrl: './service-list.component.html',
})
export default class ServicesListComponent implements OnInit {
  private servicesService = inject(ServicesService);

  services: ExtendedService[] = [];
  statusTabs = [
    { label: 'Confirmados', status: 'Confirmado' },
    { label: 'Pendientes de Confirmar', status: 'Pendiente' },
    { label: 'Esperando Finalización', status: 'Pendiente Finalización' },
    { label: 'Nueva Fecha Propuesta', status: 'Propuesta nueva fecha' },
    { label: 'Finalizados', status: 'Finalizado' },
  ];

  activeTabIndex = 0;
  isLoading = true;
  currentPage = 1;

  ngOnInit(): void {
    this.loadServicesForCurrentTab();
  }

  loadServicesForCurrentTab() {
    this.isLoading = true;
    const currentStatus = this.statusTabs[this.activeTabIndex].status;

    this.servicesService.getServices(currentStatus).subscribe((data) => {
      this.services = data;
      this.isLoading = false;
      this.currentPage = 1;
    });
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.loadServicesForCurrentTab();
  }
}
