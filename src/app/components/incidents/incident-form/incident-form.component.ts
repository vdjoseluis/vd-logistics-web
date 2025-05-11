import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncidentsService } from '../../../services/incidents.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatDatepickerModule, MatTimepickerModule],
  templateUrl: './incident-form.component.html',
  styles: ``
})
export default class IncidentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private incidentsService = inject(IncidentsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  incidentId: string = '';
  serviceId: string = '';
  user: string = '';

  constructor() {
    const navigation = window.history.state;
    this.serviceId = navigation['serviceId'];
    this.user = navigation['user'];
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      user: [this.user, Validators.required],
      service: [this.serviceId, Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEdit = true;
        this.incidentId = id;

        this.incidentsService.getIncidentById(id).subscribe(incident => {
          if (incident) {
            console.log({ incident });
            this.form.patchValue({
              id,
              ...incident,
            });
          } else {
            this.router.navigate(['/dashboard/incidents']);
          }
        });
      } else {
        this.isEdit = false;
        this.form.patchValue({
          date: new Date().toLocaleDateString(),
          time: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0'),
        });

      }
    });
  }

  onSubmit() {
    //TODO: Guardar servicio
  }
}
