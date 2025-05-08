import { Component, inject, OnInit } from '@angular/core';
import { Log } from '../../../models/log.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { LogsService } from '../../../services/logs.service';

type ExtendedLog = Log & {
  id: string;
  dateFormatted: string;
  action: string;
  operatorName: string;
  serviceId: string;
};

@Component({
  selector: 'app-logs-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './logs-list.component.html',
})
export default class LogsListComponent implements OnInit {
  private logsService = inject(LogsService);
  logs: ExtendedLog[] = [];
  currentPage = 1;
  isLoading = true;

  ngOnInit() {
    this.logsService.getLogs().subscribe(data => {
      this.logs = data;
      this.isLoading = false;
    });
  }
}
