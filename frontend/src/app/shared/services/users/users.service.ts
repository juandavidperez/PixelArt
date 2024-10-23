import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {registerUsers} from "../../../interfaces/registerUsers";
import {HttpClient} from "@angular/common/http";
import {LoginUsers} from "../../../interfaces/loginUsers";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:4002/users';

  constructor(private http: HttpClient) {}

  addUser(user: registerUsers): Observable<registerUsers> {
    return this.http.post<registerUsers>(`${this.apiUrl}/save`, user);
  }

  loginUser(user: LoginUsers): Observable<registerUsers> {
    return this.http.post<registerUsers>(`${this.apiUrl}/getUser`, user);
  }


}
