import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SearchService } from "../services/searchService/search.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLink,
    FormsModule,
    CommonModule
  ],
  standalone: true
})
export class HeaderComponent {

  searchTerm: string = '';
  isToken: boolean = false;

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken'); 

    if (token) {
      this.isToken = true;
    } else {
      this.isToken = false;
    }
  }

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['main/search'], { queryParams: { q: this.searchTerm } });
  }

  cerrarSesion(){
    localStorage.removeItem('authToken');
    window.location.reload();
  }

}
