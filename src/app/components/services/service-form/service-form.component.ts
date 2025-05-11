import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, provideZoneChangeDetection } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomersService } from '../../../services/customers.service';
import { ServicesService } from '../../../services/services.service';
import { UsersService } from '../../../services/users.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule,
    FormsModule, ReactiveFormsModule, RouterLink, MatDatepickerModule, MatFormFieldModule, MatTimepickerModule],
  templateUrl: './service-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,


})
export default class ServiceFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicesService = inject(ServicesService);
  private customersService = inject(CustomersService);
  private usersService = inject(UsersService);

  serviceForm!: FormGroup;
  isEdit = false;
  status = ['Pendiente', 'Confirmado', 'Finalizado', 'Propuesta nueva fecha', 'Pendiente Finalización', 'Incidencia'];
  serviceId: string = '';
  operatorNames = new Observable<{ id: string; firstName: string; lastName: string }[]>();
  customerNames = new Observable<{ id: string; firstName: string; lastName: string }[]>();

  ngOnInit(): void {
    this.operatorNames = this.usersService.getUsersByType('Operario');
    this.customerNames = this.customersService.getAllCustomers();
    this.serviceForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      customer: ['', Validators.required],
      user: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Pendiente', Validators.required],
      type: ['Medición', Validators.required],
      comments: [''],
      sharedFiles: this.fb.array([]),
      operatorFiles: this.fb.array([]),
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEdit = true;
        this.serviceId = id;

        this.servicesService.getServiceById(id).subscribe(service => {
          console.log({ service });
          if (service) {
            this.serviceForm.patchValue({
              id,
              ...service,
            });
            this.populateFileArray('sharedFiles', service.sharedFiles);
            this.populateFileArray('operatorFiles', service.operatorFiles);
          } else {
            this.router.navigate(['/dashboard/services']);
          }
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  private populateFileArray(controlName: string, files: string[]) {
    const fileArray = this.serviceForm.get(controlName) as FormArray;
    fileArray.clear(); // Limpiar antes de agregar nuevos archivos

    files.forEach(fileUrl => {
      const fileName = decodeURIComponent(fileUrl.split('%2F').pop()?.split('?')[0] ?? '');
      fileArray.push(this.fb.group({ name: fileName, url: fileUrl }));
    });
  }

  // Validaciones y filtro para la fecha
  private readonly _currentDate = new Date();
  get minDate(): Date {
    const tomorrow = new Date(
      this._currentDate.getFullYear(),
      this._currentDate.getMonth(),
      this._currentDate.getDate() + 1
    );
    if (tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 2);
    } else if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    return tomorrow;
  }
  myFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Manejo de archivos del Storage
  get filesArray() {
    return this.serviceForm.get('sharedFiles') as FormArray;
  }
  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.filesArray.push(this.fb.control(selectedFiles[i]));
    }
  }
  removeFile(index: number, array: any) {
    array.removeAt(index);
  }
  openFile(index: number) {
    const file = this.filesArray.controls[index].value;
    window.open(URL.createObjectURL(file), '_blank');
  }

  onSelectService(serviceId: string, user: string) {
    this.router.navigate(['/dashboard/incident', 'new'], { state: { serviceId, user } });
  }

  onSubmit() {
    //TODO: Guardar servicio
  }


}
