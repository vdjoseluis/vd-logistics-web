import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.component.html',
})
export default class CustomerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private customersService = inject(CustomersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  customerId: string = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],  //TODO: Agregar validacion telefono
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required], //TODO: Agregar validacion direccion
      addressAdditional: [''],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEdit = true;
        this.customerId = id;

        this.customersService.getCustomerById(id).subscribe(customer => {
          if (customer) {
            this.form.patchValue({
              id,
              ...customer,
            });
          } else {
            this.router.navigate(['customers']);
          }
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const customerData: Omit<Customer, 'id'> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address,
      addressAdditional: formValue.addressAdditional
    };

    try {
      if (this.isEdit) {
        await this.customersService.updateCustomer(this.customerId, customerData);
      } else {
        await this.customersService.createCustomer(customerData);
      }

      this.router.navigate(['/dashboard/customers']);
    } catch (error) {
      console.error('Error guardando cliente:', error);
    }
  }
}
