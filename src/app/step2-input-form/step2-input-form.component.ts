import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-step2-input-form',
  templateUrl: './step2-input-form.component.html',
  styleUrls: ['./step2-input-form.component.scss'],
})
export class Step2InputFormComponent implements OnInit, OnChanges {
  @Input()
  isToggled: boolean = false;

  @Input()
  tabNameSelected: string = '';

  @Input()
  disableDiv?: boolean = true;

  @Input()
  dataToFillInForms: any;

  formLabel: string = 'Step 2';
  step2InputForm: FormGroup = {} as FormGroup;

  pppTypes: string[] = ['Hard', 'Declining', '1%'];
  pppTerms: string[] = [
    '60 Mos.',
    '48 Mos.',
    '36 Mos.',
    '24 Mos.',
    '12 Mos.',
    'No PPP',
  ];

  constructor(private formsService: FormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.populateFormIfDataAvailable();
  }

  populateFormIfDataAvailable() {
    if (Object.keys(this.dataToFillInForms || {}).length) {
      this.step2InputForm.setValue({
        loan_amount: this.dataToFillInForms.loan_inputs['loan_amount'],
        annual_taxes: this.dataToFillInForms.loan_inputs['annual_taxes'],
        annual_hoi: this.dataToFillInForms.loan_inputs['annual_hoi'],
        annual_other: this.dataToFillInForms.loan_inputs['annual_other'],
        origination_points:
          this.dataToFillInForms.loan_inputs['origination_points'],
        broker_points: this.dataToFillInForms.loan_inputs['broker_points'],
        other_costs: this.dataToFillInForms.loan_inputs['other_costs'],
        ppp_type: this.dataToFillInForms.loan_inputs['ppp_type'],
        ppp_term: this.dataToFillInForms.loan_inputs['ppp_term'],
        units: this.dataToFillInForms.loan_inputs['units'],
        zip_code: this.dataToFillInForms.loan_inputs['zip_code'],
      });
    }
  }

  ngOnInit(): void {
    this.step2InputForm = new FormGroup({
      loan_amount: new FormControl(null),
      annual_taxes: new FormControl(null),
      annual_hoi: new FormControl(null),
      annual_other: new FormControl(null),
      origination_points: new FormControl(null),
      broker_points: new FormControl(null),
      other_costs: new FormControl(null),
      units: new FormControl(null),
      zip_code: new FormControl(null),
      ppp_type: new FormControl('Hard'),
      ppp_term: new FormControl('60 Mos.'),
    });
    this.step2InputForm.valueChanges.subscribe(formChanges => this.formsService.dataChangeEmitter.next(
      {
      key: 'step2',
      data: formChanges
    }));
    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1')
        this.disableDiv = !eventData.data['fico'] ||  !eventData.data['appraised_value'];
    });
  }

  getClassToApply() {
    if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }
}
