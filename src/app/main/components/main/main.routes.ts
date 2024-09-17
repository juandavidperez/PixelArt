import {Routes} from "@angular/router";
import {GalleryComponent} from "./gallery/gallery.component";
import {SearchComponent} from "./search/search.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

