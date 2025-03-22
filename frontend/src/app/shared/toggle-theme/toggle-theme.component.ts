import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-toggle-theme',
  imports: [ButtonModule, CommonModule],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.css'
})
export class ToggleThemeComponent {

  isDarkMode = false;

  toggleDarkMode() {
    const element = document.querySelector('html')!; 
    element.classList.toggle('my-app-dark');
    this.isDarkMode = !this.isDarkMode;
  }

}
