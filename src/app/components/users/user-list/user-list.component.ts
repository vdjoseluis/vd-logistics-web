import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLink],
  templateUrl: './user-list.component.html',
})
export default class UserListComponent implements OnInit {
  private usersService = inject(UsersService);
  private router = inject(Router);
  users: (User & { id: string })[] = [];

  currentPage = 1;
  isLoading = true;

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe(data => {
      this.users = data;
      this.isLoading = false;
    });
  }

  goToEditUser(userId: string) {
    this.router.navigate(['/dashboard/user', userId]);
  }
}
