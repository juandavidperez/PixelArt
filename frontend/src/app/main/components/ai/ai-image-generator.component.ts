import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiImageService } from '../../../shared/services/ai/ai-image.service'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
  

  constructor(private aiImageService: AiImageService , private cdr: ChangeDetectorRef) {}

  

  generateImage() {
  this.loading = true;
  this.errorMessage = null;
  
  this.aiImageService.generateImage(this.promptText).subscribe({
    next: (response) => {
      console.log('Respuesta recibida:', response);
      this.loading = false;
      this.generatedImageUrl = response.imageUrl;
      this.cdr.detectChanges(); // Forzar actualización
    },
    error: (err) => {
      console.error('Error al generar imagen:', err);
      this.loading = false;
      this.errorMessage = 'Ocurrió un error al generar la imagen: ' + (err.message || 'Error desconocido');
    }
    });
  }

  abrirImagen() {
    if (!this.generatedImageUrl) return;
  
    // If the image is already a URL, open it normally
    if (!this.generatedImageUrl.startsWith('data:image')) {
      window.open(this.generatedImageUrl, '_blank');
      return;
    }
  
    // Convert Base64 to a Blob
    const byteString = atob(this.generatedImageUrl!.split(',')[1]);
    const mimeString = this.generatedImageUrl!.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
  
    const blob = new Blob([uint8Array], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);
  
    // Open in a new tab
    window.open(blobUrl, '_blank');
  }

  enhancePrompt() {
    // Implementación de mejorar prompt
  }
}