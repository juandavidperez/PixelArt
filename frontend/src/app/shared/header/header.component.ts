import {Component, HostListener, OnInit} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import {TokenUserService} from "../services/tokenUser/token-user.service";
import {ToolbarModule} from "primeng/toolbar";
import {SidebarModule} from "primeng/sidebar";
import {Button} from "primeng/button";
import {Avatar} from "primeng/avatar"; 
import { CardModule } from 'primeng/card';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    SidebarModule,
    CardModule,
    ToolbarModule,
    TreeModule,
    Button,
    OverlayPanelModule,
    Avatar
]
})
export class HeaderComponent implements OnInit{
  searchTerm: string = '';
  isToken: boolean = false;
  userName: string | null = null;
  sidebarVisible = false;
  isMobile = false;
  width: any;

  files: TreeNode[] = [];
  
  constructor(private tokenUserService: TokenUserService, private router: Router) {}

  ngOnInit() {
    this.isToken = this.tokenUserService.isAuthenticated();
    this.userName = this.tokenUserService.getUserName();

    this.files = [
      {
        label: 'Documentos',
        data: 'Document Folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [
          {
            label: 'CV.pdf',
            data: 'Curriculum Vitae',
            icon: 'pi pi-file-pdf',
            leaf: true
          },
          {
            label: 'Carta.docx',
            data: 'Carta de Presentación',
            icon: 'pi pi-file-word',
            leaf: true
          }
        ]
      },
      {
        label: 'Imágenes',
        data: 'Images Folder',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        children: [
          {
            label: 'playa.png',
            data: 'Foto de playa',
            icon: 'pi pi-image',
            leaf: true
          },
          {
            label: 'montaña.jpg',
            data: 'Foto de montaña',
            icon: 'pi pi-image',
            leaf: true
          }
        ]
      }
    ];

  }

  onSearch() {
    this.router.navigate(['main/search'], { queryParams: { q: this.searchTerm } });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 840;  
  }

  cerrarSesion() {
    this.tokenUserService.clearToken();
    this.router.navigate(['/login']);
  }

  verPerfil() {
    this.router.navigate(['/user']);
  }

}
