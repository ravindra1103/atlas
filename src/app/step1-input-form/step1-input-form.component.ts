import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { data } from '../data/ui-metadata';
import { FormService } from '../shared/form.service';
import { InputForm, RecordInput, SingleSectionTab } from '../shared/interfaces';

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

  formLabel: string = 'Step 1';
  step1InputForm: FormGroup = {} as FormGroup;
  showUPB: boolean = false;
  showAcquisitionDate: boolean = false;

  loanPurpose: string[] = ['Purchase', 'Delayed Purchase', 'Rate/Term', 'Cash Out'];
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
        upb:  this.dataToFillInForms.loan_inputs['upb'],
        units: this.dataToFillInForms.loan_inputs['units'] || 0,
        zip_code: this.dataToFillInForms.loan_inputs['zip_code'] || '-',
        acquisition_date: this.dataToFillInForms.loan_inputs['acquisition_date'] || '-',
        rehab_amount: this.dataToFillInForms.loan_inputs['rehab_amount'],
        arv: this.dataToFillInForms.loan_inputs['arv'],
      })
    }
  }

  ngOnInit(): void {
    this.step1InputForm = new FormGroup({
      fico: new FormControl(null),
      loan_purpose: new FormControl('Purchase'),
      experience: new FormControl(null),
      property_type: new FormControl('SFR'),
      appraised_value: new FormControl(null),
      purchase_price: new FormControl(null),
      upb: new FormControl(null),
      units: new FormControl(null),
      zip_code: new FormControl(null),
      acquisition_date: new FormControl(null),
      rehab_amount: new FormControl(null),
      arv: new FormControl(null),
    });

    this.step1InputForm.valueChanges.subscribe(formChanges => {
      this.formsService.dataChangeEmitter.next({
        key: 'step1',
        data: formChanges
      });
    });
    this.showAcquisitionDate = false
  }

  getClassToApply() {
    if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }

  onChangeLoanPurchase(event: any) {
    if (event.value !== 'Purchase')
      this.showAcquisitionDate = true;
    else 
      this.showAcquisitionDate = false;

    if(['Purchase', 'Delayed Purchase'].includes(event.value)) {
      this.showUPB = false;
    }
    else if (['Rate/Term','Cash Out'].includes(event.value)) {
      this.showUPB = true;
    }
  }

  onChangePropertyType(event: any) {
    if (event.value !== '5+ Units') {

    }
  }
}
