import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main/components/main/main.component";
import {DrawComponent} from "./main/components/draw/draw.component";
import {LoginComponent} from "./main/components/login/login.component";
import {RegisterComponent} from "./main/components/register/register.component";
import {BrowserModule} from "@angular/platform-browser";

export const routes: Routes = [
  { path: 'main', component: MainComponent, loadChildren: () => import('./main/components/main/main.routes').then((m) => m.routes)  },
  { path: 'draw', component: DrawComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '' , redirectTo: 'main' ,pathMatch: 'full'}
];

