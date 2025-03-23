import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class AiImageService {
  private apiUrl = 'http://localhost:4002/api/images/generate'; 
  

  constructor(private http: HttpClient) {}

  /**
   * Envía el prompt al backend y devuelve
   * @param prompt Texto con la descripción para generar la imagen
   */
  generateImage(prompt: string): Observable<{ imageUrl: string }> {
    
    const body = { prompt };
    return this.http.post<{ imageUrl: string }>(this.apiUrl, body);
  }
}
