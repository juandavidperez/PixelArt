import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {PixelArt, PixelArtCreateDto, PixelArtUpdateDto} from "../../../interfaces/pixelArt.interface";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PixelArtService {

  constructor(private http : HttpClient, private cd: ChangeDetectorRef) { }

  private apiPixelArt = 'http://localhost:4002/art';
  listOfPixelArt: PixelArt[] = [];

  getAllArts(): Observable<PixelArt[]>{
    return this.http.get<PixelArt[]>(`${this.apiPixelArt}`);
  }

  saveArt(pixelArtSave: FormData): Observable<any> {
    return this.http.post(`${this.apiPixelArt}/create`, pixelArtSave);
  }

  updateArt(pixelArtUpdate : PixelArtUpdateDto): Observable<PixelArtUpdateDto> {
    return this.http.put<PixelArtUpdateDto>(`${this.apiPixelArt}` , pixelArtUpdate);
  }

  deleteArt(id:number) : Observable<PixelArt> {
    return this.http.delete<PixelArt>(`${this.apiPixelArt}/${id}`);
  }


  loadArts(){
    this.getAllArts().subscribe(
      (data: PixelArt[]) => {
        this.listOfPixelArt = data;
        this.cd.markForCheck();
        console.log(data);
      },
      error =>  console.log('Error al cargar los datos : ' + error)
    );
  }

}
