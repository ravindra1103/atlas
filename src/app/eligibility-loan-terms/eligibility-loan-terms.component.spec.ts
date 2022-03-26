import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityLoanTermsComponent } from './eligibility-loan-terms.component';

describe('EligibilityLoanTermsComponent', () => {
  let component: EligibilityLoanTermsComponent;
  let fixture: ComponentFixture<EligibilityLoanTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibilityLoanTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityLoanTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
