import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink,
    CommonModule
  ],
  standalone: true
})
export class HomeComponent {

  isToken: boolean = false;

  ngOnInit() {
    const token = localStorage.getItem('authToken'); 

    if (token) {
      this.isToken = true;
    } else {
      this.isToken = false;
    }
  }
  
}
