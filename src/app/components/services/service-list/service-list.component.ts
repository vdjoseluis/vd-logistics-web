import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ServicesService } from '../../../services/services.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Service } from '../../../models/service.model';

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
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './service-list.component.html',
})
export default class ServiceListComponent implements OnInit {
  private servicesService = inject(ServicesService);
  services: ExtendedService[] = [];

  currentPage = 1;
  isLoading = true;

  ngOnInit() {
    this.servicesService.getServices('Confirmado').subscribe(data => {
      this.services = data;
      this.isLoading = false;
    });
  }
}
