import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {RegisterComponent} from "../register/register.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  standalone: true
})
export class LoginComponent {

  constructor(private router: Router) {
  }

  directLRegister(): void {
    this.router.navigate(['register']);
  }

}
