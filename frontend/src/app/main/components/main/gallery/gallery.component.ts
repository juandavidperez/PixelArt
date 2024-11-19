import {Component, OnInit} from '@angular/core';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCardModule} from "ng-zorro-antd/card";
import {PixelArtService} from "../../../../shared/services/pixelArt/pixel-art.service";
import {NgForOf} from "@angular/common";
import {NzModalModule} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [
    NzAvatarModule,
    NzCardModule,
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
