import { Injectable } from '@angular/core';
import {UsersService} from "../users/users.service";
import {LoginUsers} from "../../../interfaces/loginUsers";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenUserService {

  private tokenKey = 'authToken';

  constructor(private userService : UsersService) {
    this.userService.loadUser();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }


  getUserName(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      return JSON.parse(atob(token.split('.')[1]))?.userName || null;
    }
    return null;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
