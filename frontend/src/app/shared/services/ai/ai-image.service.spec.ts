import { TestBed } from '@angular/core/testing';

import { AiImageService } from './ai-image.service';

describe('AiImageService', () => {
  let service: AiImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
