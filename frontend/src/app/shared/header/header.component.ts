import {Component, HostListener, OnInit} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import {TokenUserService} from "../services/tokenUser/token-user.service";
import { ToggleThemeComponent } from "../toggle-theme/toggle-theme.component";
import {ToolbarModule} from "primeng/toolbar";
import {SidebarModule} from "primeng/sidebar";
import {Button} from "primeng/button";
import {Avatar} from "primeng/avatar"; 

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    SidebarModule,
    ToggleThemeComponent,
    ToolbarModule,
    Button,
    Avatar
]
})
export class HeaderComponent implements OnInit{
  searchTerm: string = '';
  isToken: boolean = false;
  userName: string | null = null;
  sidebarVisible = false;
  isMobile = false;

  constructor(private tokenUserService: TokenUserService, private router: Router) {}

  ngOnInit() {
    this.isToken = this.tokenUserService.isAuthenticated();
    this.userName = this.tokenUserService.getUserName();
  }

  onSearch() {
    this.router.navigate(['main/search'], { queryParams: { q: this.searchTerm } });
  }

  @HostListener('window:resize', ['$event'])
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 840;  
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; 
  }

  cerrarSesion() {
    this.tokenUserService.clearToken(); 
    this.router.navigate(['/login']);
  }

}
