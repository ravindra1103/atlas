import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateStackComponent } from './rate-stack.component';

describe('RateStackComponent', () => {
  let component: RateStackComponent;
  let fixture: ComponentFixture<RateStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateStackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
