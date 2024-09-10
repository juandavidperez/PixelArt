import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './main/components/login/login.component';
import { DrawComponent } from './main/components/draw/draw.component';
import { GalleryComponent } from './main/components/gallery/gallery.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    DrawComponent,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
