import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiImageService } from '../../../shared/services/ai/ai-image.service'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-ai-image-generator',
  templateUrl: './ai-image-generator.component.html',
  styleUrls: ['./ai-image-generator.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AiImageGeneratorComponent {
  promptText = '';
  loading = false;
  generatedImageUrl: string | null = null;
  errorMessage: string | null = null;
  showPrompt = false;

  constructor(private aiImageService: AiImageService) {}

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
    
    console.log('Enviando prompt:', this.promptText);
    
    this.aiImageService.generateImage(this.promptText).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        this.loading = false;
        this.generatedImageUrl = response.imageUrl;
        console.log('URL de imagen asignada:', this.generatedImageUrl);
      },
      error: (err) => {
        console.error('Error al generar imagen:', err);
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al generar la imagen: ' + (err.message || 'Error desconocido');
      }
    });
  }

  enhancePrompt() {
    // Implementación de mejorar prompt
  }
}