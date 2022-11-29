import { TestBed } from '@angular/core/testing';

import { CashInflowService } from './cash-inflow.service';

describe('CashInflowService', () => {
  let service: CashInflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashInflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
