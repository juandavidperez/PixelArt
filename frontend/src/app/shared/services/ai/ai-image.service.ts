import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' 
})
export class AiImageService {
  private generateApiUrl = 'http://localhost:4002/api/images/generate'; 
  private editApiUrl = 'http://localhost:4002/api/images/edit-image';

  constructor(private http: HttpClient) {}

  /**
   * Envía el prompt al backend y devuelve
   * @param prompt Texto con la descripción para generar la imagen
   */
  generateImage(prompt: string): Observable<{ imageUrl: string }> {
    
    const body = { prompt };
    return this.http.post<{ imageUrl: string }>(this.generateApiUrl, body);
  }


  /**
   * Envía una imagen al backend para ser editada con IA
   * @param file Archivo PNG en formato RGBA, máx. 4MB
   */

  editImage(image: File, prompt: string): Observable<{ imageUrl: string  }> {
    if (!image) {
      return throwError(() => new Error('No se seleccionó ninguna imagen.'));
    }

    if (image.size > 4 * 1024 * 1024) { // 4MB en bytes
      return throwError(() => new Error('El archivo excede el límite de 4MB.'));
    }

    if (!image.type.includes('png')) {
      return throwError(() => new Error('Solo se permiten archivos PNG.'));
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    return this.http.post<{ imageUrl: string }>(this.editApiUrl, formData).pipe(
      catchError(this.handleError));
  }

  /**
   * Maneja errores de la API
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    let errorMessage = 'Error desconocido.';
    if (error.error?.message) {
        errorMessage = error.error.message;
    } else if (error.status === 0) {
        errorMessage = 'Error de conexión: No se pudo contactar al servidor.';
    } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
