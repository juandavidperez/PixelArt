import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {registerUsers} from "../../../interfaces/registerUsers";
import { HttpClient } from "@angular/common/http";
import {LoginUsers} from "../../../interfaces/loginUsers";
import {PixelArtUserDto, UserInterface} from "../../../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:4002/users';
  listOfUsers: UserInterface [] = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserInterface[]>{
    return this.http.get<UserInterface[]>(`${this.apiUrl}/get`);
  }

  getUserByUsername(username: string | null): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/getUsername/${username}`)
  }

  addUser(user: registerUsers): Observable<registerUsers> {
    return this.http.post<registerUsers>(`${this.apiUrl}/save`, user);
  }

  loginUser(user: LoginUsers): Observable<registerUsers> {
    return this.http.post<registerUsers>(`${this.apiUrl}/login`, user);
  }


  loadUser(): void{
    this.getUsers().subscribe(
      (data) => {
        this.listOfUsers = data;
      },
      error => console.log("Error al cargar los datos" + error)
    )
  }


}
