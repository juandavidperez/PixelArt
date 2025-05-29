import { Component, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PixelArt } from 'src/app/interfaces/pixelArt.interface';
import { PixelArtService } from 'src/app/shared/services/pixelArt/pixel-art.service';
import { Router } from '@angular/router';
import { TokenUserService } from 'src/app/shared/services/tokenUser/token-user.service';
import { FormsModule } from '@angular/forms';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-user',
  imports: [
    FormsModule,
    PanelMenuModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers:[PixelArtService , TokenUserService, UsersService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  constructor(
    private pixelArtService: PixelArtService,
    private router: Router,
    private tokenUserService: TokenUserService,
    private userService: UsersService
  ) {}

  activeTab: string = 'perfil';
  userData: UserInterface | null = null;

  newPassword: string = '';
  misPixelArts: PixelArt[] = [];

  items = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => (this.activeTab = 'perfil'),
    },
    {
      label: 'Mis PixelArts',
      icon: 'pi pi-image',
      command: () => this.loadPixelArts(),
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => (this.activeTab = 'cerrar'),
    },
  ];

  nombreUsuario: string = '';

  ngOnInit(): void {
    const username = this.tokenUserService.getUserName();
    if (username) {
      this.userService.getUserByUsername(username).subscribe(
        (data) => {
          this.userData = data[0];
          this.nombreUsuario = this.userData.username;
        },
        (error) => console.error('Error al cargar usuario', error)
      );
    }
  }


  guardarCambios(): void {
    if (!this.userData) return;

    const cambios = {
      ...this.userData,
      password: this.newPassword || this.userData.password, // si hay nueva contraseña, la reemplaza
    };

  
  }

  loadPixelArts(): void {
    this.activeTab = 'mis-artes';
    const username = this.userData?.username;
    if (!username) return;

    this.pixelArtService.getAllArts().subscribe((arts) => {
      this.misPixelArts = arts.filter((a) => a.userName === username);
    });
  }

  editarArt(art: PixelArt): void {
    // Implementar navegación a edición si aplica
    console.log('Editar:', art);
  }

  eliminarArt(id: number): void {
    this.pixelArtService.deleteArt(id).subscribe(() => {
      this.misPixelArts = this.misPixelArts.filter((art) => art.id !== id);
    });
  }

  cerrarSesion(): void {
    this.tokenUserService.clearToken();
    this.router.navigate(['/login']);
  }
}
