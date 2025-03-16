import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { initializeApp } from "firebase/app";
import { environment } from "../environment/environment";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { HolaComponent } from './hola/hola.component';
import { DrawComponent } from './main/components/draw/draw.component';
// import { HolaComponent } from './hola/hola.component';
import { BrowserModule } from '@angular/platform-browser';
import { AiImageGeneratorComponent } from './components/ai-image-generator/ai-image-generator.component';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  declarations: [
    HolaComponent,
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }

