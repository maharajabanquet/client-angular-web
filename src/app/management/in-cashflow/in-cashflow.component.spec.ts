import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InCashflowComponent } from './in-cashflow.component';

describe('InCashflowComponent', () => {
  let component: InCashflowComponent;
  let fixture: ComponentFixture<InCashflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InCashflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InCashflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
