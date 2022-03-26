import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedValuesComponent } from './calculated-values.component';

describe('CalculatedValuesComponent', () => {
  let component: CalculatedValuesComponent;
  let fixture: ComponentFixture<CalculatedValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatedValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
