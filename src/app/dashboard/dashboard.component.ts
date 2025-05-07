import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SidemenuComponent from '../components/sidemenu/sidemenu.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, SidemenuComponent],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent {

}
