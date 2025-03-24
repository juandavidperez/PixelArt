import { Component } from '@angular/core';
import { AiImageService } from '../../../shared/services/ai/ai-image.service'; 
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-edit-image',
  standalone: true,
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css'],
  imports: [NgIf, FormsModule]
})
export class EditImageComponent {
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  errorMessage: string = '';
  isLoading = false;
  promptText: string = ''; 
  successMessage: string = '';
  isMenuOpen = false;

  constructor(private http: HttpClient, private aiImageService: AiImageService, private cdr: ChangeDetectorRef) {}

  // Método que se ejecuta cuando el usuario selecciona un archivo
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      
      if (this.selectedFile.type !== 'image/png') {
        this.errorMessage = 'Solo se permiten imágenes PNG';
        this.selectedFile = null;
        return;
      }

      this.errorMessage = ''; // Limpiar errores anteriores
    }
  }

  // Método para subir la imagen con prompt al backend
  onUpload() {
    console.log("Método onUpload ejecutado");
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecciona una imagen primero';
      return;
    }
    if (!this.promptText.trim()) {
      this.errorMessage = 'Por favor, ingresa un prompt';
      return;
    }
  

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = ''
    this.aiImageService.editImage(this.selectedFile, this.promptText)
      .subscribe({
        next: (response) => {
            this.imageUrl = response.imageUrl;
            
            this.successMessage = 'Imagen editada exitosamente'; // Mensaje de éxito
            this.isLoading = false;
          this.cdr.detectChanges();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al subir la imagen';
          console.error(error);
          this.isLoading = false;
        }
      });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
