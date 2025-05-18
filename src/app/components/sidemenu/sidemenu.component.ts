import { Component, inject, OnInit } from '@angular/core';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { lastValueFrom } from 'rxjs';

export interface UserExtended {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
})
export default class SidemenuComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems = routes
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => !route.path?.includes(':'));

  private firstName: string | null = null;
  private lastName: string | null = null;
  userName: string | null = null;

  async ngOnInit() {
  const uid = this.authService.getCurrentUserId();
  if (uid) {
    const profile = await lastValueFrom(this.authService.getUser(uid)); // ✅ Corrección
    this.firstName = profile?.firstName ?? '';
    this.lastName = profile?.lastName ?? '';
    this.userName = `${this.firstName!.charAt(0)}. ${this.lastName}`;
  }
}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
