import { TestBed } from '@angular/core/testing';

import { PixelArtService } from './pixel-art.service';

describe('PixelArtService', () => {
  let service: PixelArtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PixelArtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
