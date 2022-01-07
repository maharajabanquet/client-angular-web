import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryTableComponent } from './enquiry-table.component';

describe('EnquiryTableComponent', () => {
  let component: EnquiryTableComponent;
  let fixture: ComponentFixture<EnquiryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnquiryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
