import { Component } from '@angular/core';
import { RouterOutlet} from "@angular/router";
import {MainComponent} from "./main/components/main/main.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MainComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pixelArt';
}
