import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/customer.model';
import { GoogleAddressService } from '../../../services/google-address.service';
import { lastValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private googleAddressService = inject(GoogleAddressService);
  private dialog = inject(MatDialog);
    private _snackBar = inject(MatSnackBar);


  form!: FormGroup;
  isEdit = false;
  customerId: string = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[67]\\d{8}$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      address: ['', Validators.required],
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
            this.router.navigate(['/dashboard/customers']);
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
      // ✅ Validar dirección si es un NUEVO cliente o si la dirección cambió en edición
      if (!this.isEdit || this.form.get('address')?.dirty) {
        const geocodedData = await this.googleAddressService.geocodeAddress(customerData.address!);

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: { message: `Google sugiere: ${geocodedData.formattedAddress}. ¿Quieres usar esta dirección?` }
        });

        const confirm = await lastValueFrom(dialogRef.afterClosed());
        if (!confirm) return;

        customerData.address = geocodedData.formattedAddress;
        customerData.city = geocodedData.city || '';
      }

      let response;
      if (this.isEdit) {
        response = await lastValueFrom(this.customersService.updateCustomer(this.customerId, customerData));
      } else {
        response = await lastValueFrom(this.customersService.createCustomer(customerData));
      }

      if (response?.success) {
        this.router.navigate(['/dashboard/customers']);
      } else {
        console.error('⚠️ Error guardando cliente:', response);
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
    }
  }

  async deleteCustomer() {
    if (!this.customerId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Seguro que quieres eliminar este cliente?' }
    });

    const confirm = await lastValueFrom(dialogRef.afterClosed());

    if (!confirm) return;

    try {
      const response = await lastValueFrom(this.customersService.deleteCustomer(this.customerId));
      if (response?.success) {
        this.openSnackBar('✅ Cliente eliminado correctamente', '');
        this.router.navigate(['/dashboard/customers']);
      } else {
        this.openSnackBar('❌ Error eliminando cliente', '');
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
      this.openSnackBar('❌ Error eliminando cliente', '');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
