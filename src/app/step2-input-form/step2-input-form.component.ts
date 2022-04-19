import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  @Input() isEdit = false;

  @Output() formUpdated = new EventEmitter();

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
    if (changes['dataToFillInForms'] && Object.keys(this.dataToFillInForms)?.length)
     {
        this.disableDiv = false;
        this.step2InputForm?.enable();
     }
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
        step2_units: this.dataToFillInForms.loan_inputs['step2_units'] || '',
        step2_zip_code:
          this.dataToFillInForms.loan_inputs['step2_zip_code'] || '',
      });
    } else {
      this.step2InputForm = new FormGroup({
        loan_amount: new FormControl(0),
        annual_taxes: new FormControl(0),
        annual_hoi: new FormControl(0),
        annual_other: new FormControl(0),
        origination_points: new FormControl(1),
        broker_points: new FormControl(1),
        other_costs: new FormControl(0),
        step2_units: new FormControl(0),
        step2_zip_code: new FormControl('-'),
        ppp_type: new FormControl('Hard'),
        ppp_term: new FormControl('60 Mos.'),
      });
      this.step2InputForm.valueChanges.subscribe((formChanges) => {
        if (
          this.isEdit &&
          (this.step2InputForm.touched || this.step2InputForm.dirty)
        ) {
          this.formUpdated.emit();
        }

        this.formsService.dataChangeEmitter.next({
          key: 'step2',
          data: formChanges,
        });
      });
      this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
        if (eventData.key === 'step1')
          this.disableDiv =
            !eventData.data['fico'] || !eventData.data['appraised_value'];
      });
      this.step2InputForm.statusChanges.subscribe((status) => {
        this.formsService.statusChangeEmitter.next({
          key: 'step2',
          status: this.getStatus(),
        });
      });
    }
  }

  ngOnInit(): void {
    this.step2InputForm = new FormGroup({
      loan_amount: new FormControl(0),
      annual_taxes: new FormControl(0),
      annual_hoi: new FormControl(0),
      annual_other: new FormControl(0),
      origination_points: new FormControl(1),
      broker_points: new FormControl(1),
      other_costs: new FormControl(0),
      step2_units: new FormControl(0),
      step2_zip_code: new FormControl('-'),
      ppp_type: new FormControl('Hard'),
      ppp_term: new FormControl('60 Mos.'),
    });
    this.step2InputForm.disable();

    this.step2InputForm.valueChanges.subscribe((formChanges) => {
      this.formsService.dataChangeEmitter.next({
        key: 'step2',
        data: formChanges,
      })
    });

    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        this.disableDiv =
          !eventData.data['fico'] || !eventData.data['appraised_value'];
        this.disableDiv
          ? this.step2InputForm.disable()
          : this.step2InputForm.enable();
      }
    });
    this.step2InputForm.statusChanges.subscribe((status) => {
      this.formsService.statusChangeEmitter.next({
        key: 'step2',
        status: this.getStatus(),
      });
    });
    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        const maxLtvSelectedPercentValue = localStorage.getItem(
          'maxLtvSelectedPercent'
        );
        let maxLtvSelectedPercent = 0;
        const value = maxLtvSelectedPercentValue?.slice(0, -1);
        if (value) {
          maxLtvSelectedPercent = +value;
        }
        if (maxLtvSelectedPercent && eventData.data['appraised_value']) {
          let loanAmount = (maxLtvSelectedPercent * eventData.data['appraised_value']*1.0/100);
          this.step2InputForm.patchValue({
             loan_amount: Math.ceil(Math.round((loanAmount + Number.EPSILON) * 100) / 100),
             other_costs: Math.ceil(Math.round(((2750 + (1.0/100 * loanAmount)) + Number.EPSILON) * 100) / 100),
            });
        }
      }
    });
  }

  getClassToApply() {
    if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }

  getStatus() {
    const step2Form = this.step2InputForm.value;
    let isValid = false;

    isValid =
      step2Form.loan_amount != null &&
      // step2Form.annual_taxes &&
      // step2Form.annual_hoi &&
      // step2Form.annual_other &&
      step2Form.origination_points != null &&
      step2Form.broker_points != null &&
      step2Form.other_costs != null;

    if (!isValid) return 'INVALID';

    if (this.tabNameSelected !== 'LTR') {
      isValid = step2Form.step2_units && step2Form.step2_zip_code?.length === 5;
    }
    return isValid ? 'VALID' : 'INVALID';
  }
}
