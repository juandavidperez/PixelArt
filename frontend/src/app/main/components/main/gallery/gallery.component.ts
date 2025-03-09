import {Component, OnInit} from '@angular/core';
import {PixelArtService} from "../../../../shared/services/pixelArt/pixel-art.service";
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [
    NgForOf
  ],
  providers:[PixelArtService]
})
export class GalleryComponent implements OnInit {

  constructor(protected pixelArtService: PixelArtService) {}


  ngOnInit() {

    this.pixelArtService.loadArts();
  }

}
