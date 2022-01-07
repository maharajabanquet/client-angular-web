import { TestBed } from '@angular/core/testing';

import { EnquiryServiceService } from './enquiry-service.service';

describe('EnquiryServiceService', () => {
  let service: EnquiryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnquiryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
