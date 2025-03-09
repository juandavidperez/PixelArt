import {Component, OnInit} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SearchService } from "../services/searchService/search.service";
import { CommonModule } from '@angular/common';
import {TokenUserService} from "../services/tokenUser/token-user.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    imports: [
        RouterLink,
        FormsModule,
        CommonModule
    ]
})
export class HeaderComponent implements OnInit{
  searchTerm: string = '';
  isToken: boolean = false;
  userName: string | null = null;

  constructor(private tokenUserService: TokenUserService, private router: Router) {}

  ngOnInit() {
    this.isToken = this.tokenUserService.isAuthenticated();
    this.userName = this.tokenUserService.getUserName();
  }

  onSearch() {
    this.router.navigate(['main/search'], { queryParams: { q: this.searchTerm } });
  }

  cerrarSesion() {
    this.tokenUserService.clearToken();
    this.router.navigate(['/login']);
  }

}
