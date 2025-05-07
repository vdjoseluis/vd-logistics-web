import { Component, inject, OnInit } from '@angular/core';
import { routes } from '../../app.routes';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidemenu.component.html',
})
export default class SidemenuComponent implements OnInit {
  private auth = inject(AuthService);
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
    const profile = await this.auth.getCurrentUserProfile();
    this.firstName = profile?.['firstName'] ?? '';
    this.lastName = profile?.['lastName'] ?? '';
    this.userName = this.firstName?.charAt(0) + '. ' + this.lastName;
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
