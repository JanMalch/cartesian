import { TestBed } from '@angular/core/testing';

import { Cartesian } from './cartesian';

describe('Cartesian', () => {
  let service: Cartesian;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cartesian);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
