import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../../../shared/header/header.component";
import {FooterComponent} from "../../../shared/footer/footer.component";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-main',
    imports: [CommonModule,RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

}
