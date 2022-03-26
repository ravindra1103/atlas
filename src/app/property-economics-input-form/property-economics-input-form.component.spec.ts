import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyEconomicsInputFormComponent } from './property-economics-input-form.component';

describe('PropertyEconomicsInputFormComponent', () => {
  let component: PropertyEconomicsInputFormComponent;
  let fixture: ComponentFixture<PropertyEconomicsInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyEconomicsInputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyEconomicsInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
