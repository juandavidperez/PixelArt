import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Categories, PixelArt, PixelArtUpdateDto} from "../../../interfaces/pixelArt.interface";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PixelArtService {

  constructor(private http : HttpClient, private cd: ChangeDetectorRef) { }

  private apiPixelArt = 'http://localhost:4002/art';
  listOfPixelArt: PixelArt[] = [];
  listOfCategories: Categories[] = [];

  getAllArts(): Observable<PixelArt[]>{
    return this.http.get<PixelArt[]>(`${this.apiPixelArt}`);
  }

  getAllCategories(): Observable<Categories[]> {
    return this.http.get<Categories[]>(`${this.apiPixelArt}/getCategories`)
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
      },
      error =>  console.log('Error al cargar los datos : ' + error)
    );
  }

  loadCategories(){
    this.getAllCategories().subscribe(
      (data: Categories[]) => {
        this.listOfCategories = data;
        this.cd.markForCheck();
      },
      error =>  console.log('Error al cargar los datos : ' + error)
    )
  }

}
