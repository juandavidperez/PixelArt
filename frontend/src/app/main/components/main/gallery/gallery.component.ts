import {Component, OnInit} from '@angular/core';
import {PixelArtService} from "../../../../shared/services/pixelArt/pixel-art.service";
import { NgForOf } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Categories, PixelArt } from 'src/app/interfaces/pixelArt.interface';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css'],
    imports: [
        NgForOf,
        FormsModule,
        CardModule,
        AutoCompleteModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ButtonModule
    ],
    providers: [PixelArtService],
    standalone: true
})
export class GalleryComponent implements OnInit {

  constructor(protected pixelArtService: PixelArtService) {}

  arts: PixelArt[] = [];
  filteredArts: PixelArt[] = [];

  searchTerm: string = '';

  categories: Categories[] = [];
  filteredCategories: Categories[] = [];

  selectedCategory: Categories | null = null;



  ngOnInit() {
    this.pixelArtService.getAllArts().subscribe((data: PixelArt[]) => {
      this.arts = data;
      this.filteredArts = data;
    });

    this.pixelArtService.getAllCategories().subscribe((data: Categories[]) => {
      this.categories = data;
    });
  }


  filterCategories(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }


  filterArts(): void {
    this.filteredArts = this.arts.filter(art => {
      const matchesTitle = art.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? art.category === this.selectedCategory.name : true;
      return matchesTitle && matchesCategory;
    });
  }


}

