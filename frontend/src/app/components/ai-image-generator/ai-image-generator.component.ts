import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-ai-image-generator',
  templateUrl: './ai-image-generator.component.html',
  styleUrls: ['./ai-image-generator.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AiImageGeneratorComponent {
  promptText = '';
  loading = false;
  generatedImageUrl: string | null = null;
  errorMessage: string | null = null;
  showPrompt = false;  
  togglePrompt() {
    this.showPrompt = !this.showPrompt;
  }

  generateImage() {
    if (!this.promptText.trim()) {
      this.errorMessage = 'El prompt no puede estar vacío.';
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.generatedImageUrl = null;

    // Simulación de la llamada a API
    setTimeout(() => {
      this.loading = false;
      this.generatedImageUrl = 'https://via.placeholder.com/300';
    }, 2000);
  }

  enhancePrompt() {
    alert('Funcionalidad de mejorar prompt en desarrollo...');
  }
}
