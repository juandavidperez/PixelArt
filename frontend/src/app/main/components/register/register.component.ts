import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { LoginComponent } from '../login/login.component';
import {Router, RouterModule} from "@angular/router";
import {UsersService} from "../../../shared/services/users/users.service";
import {registerUsers} from "../../../interfaces/registerUsers";

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;
  registrationSuccess = false;
  registrationError = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUser: registerUsers = {
        id: 0,
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      this.usersService.addUser(newUser).subscribe(
        response => {
          console.log('Usuario registrado exitosamente', response);
          this.registrationSuccess = true;
          this.registerForm.reset();
          this.router.navigate(['login']);
        },
        error => {
          console.log('Error al registrar el usuario', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  directLogin(): void {
    this.router.navigate(['login']);
  }

}
