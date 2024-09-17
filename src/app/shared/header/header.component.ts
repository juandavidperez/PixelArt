import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SearchService} from "../services/searchService/search.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    RouterLink,
    FormsModule
  ],
  standalone: true
})
export class HeaderComponent {

  searchTerm: string = '';

  constructor(private searchService: SearchService, private router: Router) {}

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['main/search'], { queryParams: { q: this.searchTerm } });
  }

}
