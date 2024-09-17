import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {usuarios} from "../../../interfaces/usuarios";

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  constructor(private fireStore: Firestore) { }

  addUser(user: usuarios) {
    const userRef = collection(this.fireStore, 'usuarios');
    return addDoc(userRef, user);
  }
}
