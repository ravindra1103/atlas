import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1InputFormComponent } from './step1-input-form.component';

describe('Step1InputFormComponent', () => {
  let component: Step1InputFormComponent;
  let fixture: ComponentFixture<Step1InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step1InputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step1InputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
