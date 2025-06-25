import { TestBed } from '@angular/core/testing';

import { SearchValidationService } from './search-validation.service';

describe('SearchValidationService', () => {
  let service: SearchValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
