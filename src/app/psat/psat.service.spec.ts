import { TestBed, inject } from '@angular/core/testing';

import { PsatService } from './psat.service';

describe('PsatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsatService]
    });
  });

  it('should ...', inject([PsatService], (service: PsatService) => {
    expect(service).toBeTruthy();
  }));
});
