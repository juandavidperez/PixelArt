import {CommonModule, NgFor} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {PixelArtService} from "../../../../shared/services/pixelArt/pixel-art.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink,
    CommonModule,
    NgFor
  ],
  providers:[PixelArtService],
  standalone: true
})
export class HomeComponent implements OnInit {

  isToken: boolean = false;

  constructor(protected pixelArtService: PixelArtService) {}

  ngOnInit() {
    this.pixelArtService.loadArts();
    const token = localStorage.getItem('authToken');

    if (token) {
      this.isToken = true;
    } else {
      this.isToken = false;
    }
  }

}
