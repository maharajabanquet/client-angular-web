import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TentHouseComponent } from './tent-house.component';

describe('TentHouseComponent', () => {
  let component: TentHouseComponent;
  let fixture: ComponentFixture<TentHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TentHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TentHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
