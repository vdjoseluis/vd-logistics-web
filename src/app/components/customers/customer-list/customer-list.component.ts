import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/customer.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLink],
  templateUrl: './customer-list.component.html',
})
export default class CustomerListComponent implements OnInit {
  private customersService = inject(CustomersService);
  customers : Partial<Customer>[] = [];

  currentPage = 1;
  isLoading = true;

  ngOnInit(): void {
    this.customersService.getAllCustomers().subscribe(data => {
      this.customers = data;
      this.isLoading = false;
    });
  }
}
