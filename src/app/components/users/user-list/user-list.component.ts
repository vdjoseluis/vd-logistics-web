import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
})
export default class UserListComponent implements OnInit {
  private usersService = inject(UsersService);
  users$!: Observable<(User & {id:string})[]>;

  ngOnInit(): void {
    this.users$ = this.usersService.getAllUsers();
  }

}
