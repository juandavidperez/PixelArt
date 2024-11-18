import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {RegisterComponent} from "../register/register.component";
import { CommonModule } from '@angular/common';
import {UsersService} from "../../../shared/services/users/users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  loginSuccess = false;
  loginError = false;
  errorMessage: string = ''; // Para mostrar mensajes de error

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      console.log('Intentando iniciar sesión con:', { email, password });
  
      this.usersService.loginUser({ email, password }).subscribe({
        next: (data) => {
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Token guardado:', data.token);
            this.router.navigate(['main']);
          } else {
            console.error('No se recibió un token en la respuesta');
          }
        },
        error: (error) => {
          console.error("Inicio de sesión no válido", error);
          this.loginError = true;
          this.errorMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
        }
      });
    } else {
      console.log('Formulario inválido');
      this.loginError = true;
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
    }
  }

  directLRegister(): void {
    this.router.navigate(['register']);
  }
}


