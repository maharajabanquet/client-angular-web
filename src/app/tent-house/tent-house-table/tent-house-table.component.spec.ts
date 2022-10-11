import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentHouseTableComponent } from './tent-house-table.component';

describe('TentHouseTableComponent', () => {
  let component: TentHouseTableComponent;
  let fixture: ComponentFixture<TentHouseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TentHouseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TentHouseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
