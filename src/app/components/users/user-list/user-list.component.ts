import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './user-list.component.html',
})
export default class UserListComponent implements OnInit {
  private usersService = inject(UsersService);
  users: (User & { id: string })[] = [];

  currentPage = 1;
  isLoading = true;

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      this.isLoading = false;
    });
  }
}
