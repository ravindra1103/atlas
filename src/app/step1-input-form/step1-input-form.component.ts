import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-step1-input-form',
  templateUrl: './step1-input-form.component.html',
  styleUrls: ['./step1-input-form.component.scss'],
})
export class Step1InputFormComponent implements OnInit, OnChanges {
  @Input()
  isToggled: boolean = false;

  @Input()
  tabNameSelected: string = '';

  @Input()
  disableDiv?: boolean = false;

  @Input()
  dataToFillInForms: any;

  @Input() isEdit = false;

  @Output() formUpdated = new EventEmitter();

  formLabel: string = 'Step 1';
  step1InputForm: FormGroup = {} as FormGroup;
  showUPB: boolean = false;
  showAcquisitionDate: boolean = false;

  loanPurpose: string[] = [
    'Purchase',
    'Delayed Purchase',
    'Rate/Term',
    'Cash Out',
  ];
  propertyType: string[] = ['SFR', 'Condo', '2-4 Unit', '5+ Units'];

  constructor(private formsService: FormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.populateFormIfDataAvailable();
  }

  populateFormIfDataAvailable() {
    if (Object.keys(this.dataToFillInForms).length) {
      if (this.dataToFillInForms.loan_inputs['loan_purpose'] !== 'Purchase')
        this.showAcquisitionDate = true;

      this.step1InputForm.setValue({
        fico: this.dataToFillInForms.loan_inputs['fico'],
        loan_purpose: this.dataToFillInForms.loan_inputs['loan_purpose'],
        experience: this.dataToFillInForms.loan_inputs['experience'],
        property_type: this.dataToFillInForms.loan_inputs['property_type'],
        appraised_value: this.dataToFillInForms.loan_inputs['appraised_value'],
        purchase_price: this.dataToFillInForms.loan_inputs['purchase_price'],
        upb: this.dataToFillInForms.loan_inputs['upb'],
        units: this.dataToFillInForms.loan_inputs['units'] || 0,
        zip_code: this.dataToFillInForms.loan_inputs['zip_code'] || '-',
        acquisition_date:
          this.dataToFillInForms.loan_inputs['acquisition_date'] || new Date(),
        rehab_amount: this.dataToFillInForms.loan_inputs['rehab_amount'],
        arv: this.dataToFillInForms.loan_inputs['arv'] || 0,
      });
    } else {
      if (this.step1InputForm?.reset) {
        this.step1InputForm?.reset();
      }
      this.step1InputForm = new FormGroup({
        fico: new FormControl('-'),
        loan_purpose: new FormControl('Purchase'),
        experience: new FormControl(0),
        property_type: new FormControl('SFR'),
        appraised_value: new FormControl(0),
        purchase_price: new FormControl(0),
        upb: new FormControl(0),
        //@ts-ignore
        units: new FormControl(1,[this.validateUnits.bind(this)]),
        zip_code: new FormControl('-'),
        acquisition_date: new FormControl(new Date()),
        rehab_amount: new FormControl(0),
        arv: new FormControl(0),
      });

      this.step1InputForm.valueChanges.subscribe((formChanges) => {
        if (
          this.isEdit &&
          (this.step1InputForm.touched || this.step1InputForm.dirty)
        ) {
          this.formUpdated.emit();
        }
        if (formChanges?.acquisition_date && this.isValidDate(formChanges.acquisition_date))
          formChanges.acquisition_date =
            formChanges?.acquisition_date?.toISOString();
        
        formChanges.fico = +formChanges?.fico;

        if (formChanges.arv) formChanges.arv = +formChanges.arv;

        this.formsService.dataChangeEmitter.next({
          key: 'step1',
          data: formChanges,
        });
      });

      this.step1InputForm.statusChanges.subscribe((status) => {
        this.formsService.statusChangeEmitter.next({
          key: 'step1',
          status: this.getStatus(),
        });
      });
      this.showAcquisitionDate = false;
      
      
      this.step1InputForm?.controls['property_type']?.valueChanges.subscribe({
        next: (value: any) => {
          setTimeout(() => {
            this.step1InputForm.controls['units'].updateValueAndValidity();
          }, 100);
        }
      });
    }
  }

  ngOnInit(): void {
    this.step1InputForm = new FormGroup({
      fico: new FormControl('-'),
      loan_purpose: new FormControl('Purchase'),
      experience: new FormControl(0),
      property_type: new FormControl('SFR'),
      appraised_value: new FormControl(0),
      purchase_price: new FormControl(0),
      upb: new FormControl(0),
      //@ts-ignore
      units: new FormControl(1, [this.validateUnits.bind(this)]),
      zip_code: new FormControl('-'),
      acquisition_date: new FormControl(new Date()),
      rehab_amount: new FormControl(0),
      arv: new FormControl(0),
    });

    this.step1InputForm.valueChanges.subscribe((formChanges) => {
      formChanges.acquisition_date = formChanges.acquisition_date?.toISOString();
      formChanges.fico = +formChanges?.fico;

      if (formChanges.arv) formChanges.arv = +formChanges.arv;
      
      this.formsService.dataChangeEmitter.next({
        key: 'step1',
        data: formChanges,
      });
    });
    this.showAcquisitionDate = false;
    this.step1InputForm.statusChanges.subscribe((status) => {
      this.formsService.statusChangeEmitter.next({
        key: 'step1',
        status: this.getStatus(),
      });
    });

    //@ts-ignore
    this.step1InputForm?.controls['property_type']?.valueChanges.subscribe({
      next: (value: any) => {
        setTimeout(() => {
          this.step1InputForm.controls['units'].updateValueAndValidity();
        }, 100);
      }
    });
  }

  getClassToApply() {
    if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }

  onChangeLoanPurchase(event: any) {
    if (event.value !== 'Purchase') this.showAcquisitionDate = true;
    else this.showAcquisitionDate = false;

    if (['Purchase', 'Delayed Purchase'].includes(event.value)) {
      this.showUPB = false;
    } else if (['Rate/Term', 'Cash Out'].includes(event.value)) {
      this.showUPB = true;
    }
  }

  getStatus() {
    const step1Form = this.step1InputForm.value;
    let isValid = false;

    if (
      step1Form.loan_purpose === 'Purchase' ||
      step1Form.loan_purpose === 'Delayed Purchase'
    ) {
      isValid =
        step1Form.fico &&
        step1Form.experience &&
        step1Form.appraised_value &&
        step1Form.purchase_price;
    } else if (
      step1Form.loan_purpose === 'Rate/Term' ||
      step1Form.loan_purpose === 'Cash Out'
    ) {
      isValid =
        step1Form.fico &&
        step1Form.experience &&
        step1Form.appraised_value &&
        step1Form.upb;
    }

    if (!isValid) return 'INVALID';

    if (this.tabNameSelected === 'LTR') {
      isValid = step1Form.units && step1Form.zip_code?.length === 5 &&
             this.step1InputForm?.controls['units']?.valid;
    } else if (this.tabNameSelected === 'Rehab') {
      isValid = step1Form.rehab_amount && step1Form.arv;
    }

    return isValid ? 'VALID' : 'INVALID';
  }

  isValidDate(strDate: any) {
    if (strDate.length != 10) return false;
    let dateParts = strDate.split("/");
    let date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
    if (date.getDate() == dateParts[0] && date.getMonth() == (dateParts[1] - 1) && date.getFullYear() == dateParts[2]) {
        return true;
    }
    else return false;
  }

  validateUnits = (control: any)  => {
    if (!this.step1InputForm || !this.step1InputForm?.value)
      return null;
    const step1Form = this.step1InputForm.value;
    switch(step1Form.property_type) {
      case 'SFR': 
      case 'Condo': 
        if (control.value !== 1) {
          return {'invalidUnitValue': true};
        }
      break;
      
      case '2-4 Unit': 
      if (control.value < 2 || control.value > 4) {
        return {'invalidUnitValue': true};
      }
      break;
    }
    return null;
  }

  getNgInvalidClassIfRequired() {
    const unitsControl = this.step1InputForm.get('units') || {};
    if (unitsControl) {
      //@ts-ignore
      return (unitsControl.errors || {}).invalidUnitValue ? 'ng-invalid': '';
    }
    return '';
  }
}
