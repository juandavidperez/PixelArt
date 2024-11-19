import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {RegisterComponent} from "../register/register.component";
import { CommonModule } from '@angular/common';
import {UsersService} from "../../../shared/services/users/users.service";
import {UserInterface} from "../../../interfaces/user.interface";

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

  dataUser: UserInterface[] = [];
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
          console.log('Respuesta del servidor:', data);  // Para depuración

          if (data && data.token) {
            localStorage.setItem('authToken', data.token);

            const decodedToken = this.decodeToken(data.token);


            const userId = decodedToken ? decodedToken.sub : null; // El 'sub' es el identificador

            if (userId) {
              // Guardamos el ID del usuario en localStorage
              localStorage.setItem('userId', userId);
              console.log('ID del usuario guardado:', userId);
            } else {
              console.error('No se encontró el ID del usuario en el token');
            }

            // Redirigimos al usuario a la página principal
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


  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    console.log( JSON.parse(decoded))
    return JSON.parse(decoded);
  }

  loadUsername(){

  }

  directLRegister(): void {
    this.router.navigate(['register']);
  }
}


