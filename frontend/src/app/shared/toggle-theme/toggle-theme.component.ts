import { Component} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-toggle-theme',
  imports: [ButtonModule],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.css'
})
export class ToggleThemeComponent {

  toggleDarkMode() {
    const element = document.querySelector('html')!; 
    element.classList.toggle('my-app-dark');
  }

}
