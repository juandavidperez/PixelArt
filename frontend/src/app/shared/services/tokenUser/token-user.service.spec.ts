import { TestBed } from '@angular/core/testing';

import { TokenUserService } from './token-user.service';

describe('TokenUserService', () => {
  let service: TokenUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
