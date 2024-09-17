import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
  imports: [
    NgOptimizedImage
  ],
  standalone: true
})
export class DrawComponent {

}
