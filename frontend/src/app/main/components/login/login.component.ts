import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {RegisterComponent} from "../register/register.component";
import { CommonModule } from '@angular/common';
import {UsersService} from "../../../shared/services/users/users.service";
import {UserInterface} from "../../../interfaces/user.interface";
import {MessageService} from "primeng/api";
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    AvatarModule
  ],
  providers:[MessageService]
})
export class LoginComponent implements OnInit{

  dataUser: UserInterface[] = [];
  loginForm!: FormGroup;
  loginSuccess = false;
  loginError = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private message: MessageService,
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
          console.log('Respuesta del servidor:', data);

          if (data && data.token) {
            localStorage.setItem('authToken', data.token);

            const decodedToken = this.decodeToken(data.token);


            const userId = decodedToken ? decodedToken.sub : null;

            if (userId) {
              localStorage.setItem('userId', userId);
              console.log('ID del usuario guardado:', userId);
            } else {
              console.error('No se encontró el ID del usuario en el token');
            }
            this.router.navigate(['main']);
          } else {
            console.error('No se recibió un token en la respuesta');
          }
        },
        error: (error) => {
          console.error("Inicio de sesión no válido", error);
          this.loginError = true;
          this.message.add({ severity: 'warn', summary: 'Uups', detail: '¡Incio de sesion incorrecto!' });
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


