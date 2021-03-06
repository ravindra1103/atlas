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
import { ToastrService } from 'ngx-toastr';

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

  constructor(private formsService: FormService, private toastr: ToastrService) {}

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
        acquisition_date: this.dataToFillInForms.loan_inputs['acquisition_date']
                          ? this.formatDateReceived(this.dataToFillInForms.loan_inputs['acquisition_date'])
                          : new Date(),
        rehab_amount: this.dataToFillInForms.loan_inputs['rehab_amount'],
        arv: this.dataToFillInForms.loan_inputs['arv'] || 0,
      });
      if (['Purchase', 'Delayed Purchase'].includes(this.dataToFillInForms.loan_inputs['loan_purpose'])) {
        this.showUPB = false;
      } else if (['Rate/Term', 'Cash Out'].includes(this.dataToFillInForms.loan_inputs['loan_purpose'])) {
        this.showUPB = true;
      }

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
        step1Form.fico != null &&
        step1Form.experience != null &&
        step1Form.appraised_value != null &&
        step1Form.purchase_price != null;
    } else if (
      step1Form.loan_purpose === 'Rate/Term' ||
      step1Form.loan_purpose === 'Cash Out'
    ) {
      isValid =
        step1Form.fico != null &&
        step1Form.experience != null &&
        step1Form.appraised_value != null &&
        step1Form.upb != null;
    }

    if (!isValid) return 'INVALID';

    if (this.tabNameSelected === 'LTR') {
      isValid = step1Form.units && step1Form.zip_code?.length === 5 &&
             this.step1InputForm?.controls['units']?.valid;
    } else if (this.tabNameSelected === 'Rehab') {
      isValid = step1Form.rehab_amount != null && step1Form.arv != null;
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

  formatDateReceived(date: string) {
    const parts = date.split("/");
    console.log('got date', date);
    let sentDate = parts?.length === 3 ? new Date(+parts[0], +parts[1] - 1, +parts[2]) || new Date() : new Date();
    console.log(sentDate);
    return sentDate;
  }
  updateUnits(e: any) {
    if (e) {
      switch (e) {
        case 'SFR':
        case 'Condo':
          this.step1InputForm.patchValue({
            units: 1
          });
          break;
        case '2-4 Unit':
          this.step1InputForm.patchValue({
            units: 2
          });
          break;
        case '5+ Units':
          this.step1InputForm.patchValue({
            units: 5
          });
          break;
      }
    }
    
  }
  checkUnitRange(event: any) {
    const proptype = this.step1InputForm.get('property_type')?.value
    const unitval = this.step1InputForm.get('units')?.value
    if (proptype) {
      switch (proptype) {
        case 'SFR':
        case 'Condo':
          if (event.key != 1) {
            return false;
          }
          break;
        case '2-4 Unit':
          if (event.key < 2 || event.key > 4) {
            event.preventDefault();
            return false;
          }
         break;
        //case '5+ Units':
        //  if (event.key < 5) {
        //    return false;
        //  }
        //  break;
      }
    }
    return null;
  }
  checkUnitValidation(event: any) {
    const proptype = this.step1InputForm.get('property_type')?.value
    if (proptype) {
      switch (proptype) {
        case '5+ Units':
          if (event.target.value < 5) {
            this.step1InputForm.patchValue({
              units: 5
            });
            // alert('No. of Units cannot be less than 5 for Property type 5+ Units');
            this.toastr.error('No. of Units cannot be less than 5 for Property type 5+ Units', 'Error', { disableTimeOut: true });
          break;
      }
    }
    
    }

  }
}
