import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SearchService} from "../../../../shared/services/searchService/search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
    });

    this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
    });
  }

}
