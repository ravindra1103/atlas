import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { pairwise, startWith } from 'rxjs';
import { FormService } from '../shared/form.service';

@Component({
  selector: 'app-property-economics-input-form',
  templateUrl: './property-economics-input-form.component.html',
  styleUrls: ['./property-economics-input-form.component.scss'],
})
export class PropertyEconomicsInputFormComponent implements OnInit, OnChanges {
  @Input()
  isToggled: boolean = false;

  @Input()
  tabNameSelected: string = '';

  @Input()
  disableDiv?: boolean = true;

  @Input()
  dataToFillInForms: any = {};

  @Input() isEdit = true;
  @Output() formUpdated = new EventEmitter();

  formLabel: string = 'Property Economics';
  propertyEconomicsInputForm: FormGroup = {} as FormGroup;
  propertyEconomicsInputFormNonLtr: FormGroup = {} as FormGroup;

  exitStrategy = ['Hold', 'Sell'];
  leaseTypes = ['Long Term', 'Short Term', 'Unoccupied'];
  replicasToShow: number = 0;
  showSingleReplicaLayout = false;
  counter = 0;
  mapOfCounter = new Map();
  maxPossibleReplicas = 4;
  noOfUnitsInStep1 = 0;
  loanAmountInStep2 = 0;
  annualTaxesInStep2 = 0;
  annualHoiInStep2 = 0;
  propertyTypeStep1 = '';

  constructor(private formsService: FormService, private fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tabNameSelected === 'LTR') {
      this.populateFormIfDataAvailableLtr();
    } else {
      this.populateFormIfDataAvailableNonLtr();
    }
  }

  populateFormIfDataAvailableLtr() {
    if (Object.keys(this.dataToFillInForms).length) {
      this.replicasToShow = this.dataToFillInForms.loan_inputs.units || 0;
      this.showSingleReplicaLayout =
        this.dataToFillInForms.loan_inputs['property_type'] === '5+ Units';
      this.disableDiv = false;
      this.enableOrDisableForm();

      this.propertyEconomicsInputForm.setControl('multiReplicaLayout', this.fb.array([]));
      if (!this.showSingleReplicaLayout) {
        this.counter = 0;

        for (let i = 0; i < this.replicasToShow || 0; i++) {
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).push(
            this.fb.group({
              market_rent: this.dataToFillInForms.property_economics.property_units[i].market_rent,
              in_place_rent: this.dataToFillInForms.property_economics.property_units[i].in_place_rent,
              sq_ft: this.dataToFillInForms.property_economics.property_units[i].sq_ft,
              lease_type: this.dataToFillInForms.property_economics.property_units[i].lease_type || 'Long Term'
            })
          );
          
          this.mapOfCounter.set(`${i}0`, this.counter++);
          this.mapOfCounter.set(`${i}1`, this.counter++);
          this.mapOfCounter.set(`${i}2`, this.counter++);
          this.mapOfCounter.set(`${i}3`, this.counter++);
        }
      } else if (this.showSingleReplicaLayout) {
        this.propertyEconomicsInputForm.setValue({
          gross_rent: this.dataToFillInForms.loan_inputs['gross_rent'],
          'expense-ratio-amount':
            this.dataToFillInForms.loan_inputs['expense-ratio-amount'],
          reserves: this.dataToFillInForms.loan_inputs['reserves'],
          noi: this.dataToFillInForms.loan_inputs['noi'],
        });
      }
    } else {
      this.counter = 0;
      this.propertyEconomicsInputForm?.get('multiReplicaLayout')?.reset();
      this.replicasToShow = 0;

      this.propertyEconomicsInputFormNonLtr = new FormGroup({
        exit_strategy: new FormControl('Hold'),
        gross_rent: new FormControl(0),
        profitability_amount: new FormControl(0),
        profitability_percent: new FormControl(0),
      });

      this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
        if (eventData.key === 'step1') {
          this.disableDiv =
            !eventData.data['fico'] || !eventData.data['appraised_value'];
          this.enableOrDisableForm();

          if (eventData.data['units'] !== this.noOfUnitsInStep1) {
            this.noOfUnitsInStep1 = eventData.data['units'];
            if (this.showSingleReplicaLayout) {
             this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
            }
          }

          if (eventData.data['property_type'] !== this.propertyTypeStep1) {
            this.resetLayoutIfPropertyTypeChanged(eventData.data['property_type']);
            this.propertyTypeStep1 = eventData.data['property_type'];
          }

          this.showSingleReplicaLayout =
            eventData.data['property_type'] === '5+ Units';
          
          if (
            eventData.data['units'] != null && !this.dataToFillInForms?.property_economics?.property_units?.length
          ) {
            this.replicasToShow = eventData.data['units'] > 4 ? this.maxPossibleReplicas : eventData.data['units'];
            this.mapOfCounter.clear();
            this.counter = 0;
            this.propertyEconomicsInputForm.setControl('multiReplicaLayout', this.fb.array([]));

            for (let i = 0; i < this.replicasToShow || 0; i++) {
              (<FormArray>(
                this.propertyEconomicsInputForm.get('multiReplicaLayout')
              )).push(
                this.fb.group({
                  market_rent: 0,
                  in_place_rent: 0,
                  sq_ft: 0,
                  lease_type: 'Long Term'
                })
              );
              this.mapOfCounter.set(`${i}0`, this.counter++);
              this.mapOfCounter.set(`${i}1`, this.counter++);
              this.mapOfCounter.set(`${i}2`, this.counter++);
              this.mapOfCounter.set(`${i}3`, this.counter++);
            }
          }
        }
      });

      this.propertyEconomicsInputForm.valueChanges.pipe(startWith(null), pairwise()).subscribe(([formChagesPrev, formChanges]: [any, any]) => {
        if (
          this.isEdit &&
          (this.propertyEconomicsInputForm.touched ||
            this.propertyEconomicsInputForm.dirty)
        ) {
          this.formUpdated.emit(true);
        }
        this.formsService.dataChangeEmitter.next({
          key: this.showSingleReplicaLayout
            ? 'property_economics_single_ltr'
            : 'property_economics_multi',
          //@ts-ignore
          data: this.showSingleReplicaLayout ? this.getDataToEmit(formChanges) : [...this.getDataToEmit(formChanges)],
        });

        if (this.showSingleReplicaLayout &&
          (formChagesPrev?.['singleReplicaLayout']?.['gross_rent'] !== formChanges?.['singleReplicaLayout']?.['gross_rent'])) {
          this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
        }
      });

      this.propertyEconomicsInputFormNonLtr.valueChanges.subscribe(
        (formChanges) => {
          if (
            this.isEdit &&
            (this.propertyEconomicsInputForm.touched ||
              this.propertyEconomicsInputForm.dirty)
          ) {
            this.formUpdated.emit(true);
          }
          this.formsService.dataChangeEmitter.next({
            key: 'property_economics_single',
            data: this.getDataToEmitForNonLtr(formChanges),
          });
        }
      );

      this.propertyEconomicsInputForm.statusChanges.subscribe((status) => {
        this.formsService.statusChangeEmitter.next({
          key: 'property_economics',
          status: this.getStatus(),
        });
      });

      this.propertyEconomicsInputFormNonLtr.statusChanges.subscribe(
        (status) => {
          if (this.tabNameSelected !== 'LTR')
            this.formsService.statusChangeEmitter.next({
              key: 'property_economics',
              status: this.getStatus(),
            });
        }
      );
    }
  }

  populateFormIfDataAvailableNonLtr() {
    if (Object.keys(this.dataToFillInForms).length) {
      this.propertyEconomicsInputFormNonLtr.setValue({
        exit_strategy: this.dataToFillInForms.loan_inputs['exit_strategy'],
        gross_rent: this.dataToFillInForms.loan_inputs['mf_gross_rents'],
        profitability_amount:
          this.dataToFillInForms.loan_inputs['profitability_amount'],
        profitability_percent:
          this.dataToFillInForms.loan_inputs['profitability_percent'],
      });
    } else {

      this.propertyEconomicsInputFormNonLtr = new FormGroup({
        exit_strategy: new FormControl('Hold'),
        gross_rent: new FormControl(0),
        profitability_amount: new FormControl(0),
        profitability_percent: new FormControl(0),
      });

      this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
        if (eventData.key === 'step1') {
          this.disableDiv =
            !eventData.data['fico'] || !eventData.data['appraised_value'];
          this.enableOrDisableForm();

          if (eventData.data['units'] !== this.noOfUnitsInStep1) {
            this.noOfUnitsInStep1 = eventData.data['units'];
            if (this.showSingleReplicaLayout) {
             this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
            }
          }

          if (eventData.data['property_type'] !== this.propertyTypeStep1) {
            this.resetLayoutIfPropertyTypeChanged(eventData.data['property_type']);
            this.propertyTypeStep1 = eventData.data['property_type'];
          }

          this.showSingleReplicaLayout =
            eventData.data['property_type'] === '5+ Units';
        }
      });

      this.propertyEconomicsInputFormNonLtr.valueChanges.subscribe(
        (formChanges) => {
          this.formsService.dataChangeEmitter.next({
            key: 'property_economics_single',
            data: this.getDataToEmitForNonLtr(formChanges),
          });
        }
      );


      this.propertyEconomicsInputFormNonLtr.statusChanges.subscribe(
        (status) => {
          if (this.tabNameSelected !== 'LTR')
            this.formsService.statusChangeEmitter.next({
              key: 'property_economics',
              status: this.getStatus(),
            });
        }
      );
    }
  }

  ngOnInit(): void {
    this.propertyEconomicsInputForm = this.fb.group({
      singleReplicaLayout: new FormGroup({
        gross_rent: new FormControl(0),
        'expense-ratio-amount': new FormControl(0),
        reserves: new FormControl(0),
        noi: new FormControl(0),
      }),
      multiReplicaLayout: this.fb.array([])
    });

    this.propertyEconomicsInputFormNonLtr = new FormGroup({
      exit_strategy: new FormControl('Hold'),
      gross_rent: new FormControl(0),
      profitability_amount: new FormControl(0),
      profitability_percent: new FormControl(0),
    });

    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        this.disableDiv =
          !eventData.data['fico'] || !eventData.data['appraised_value'];
        this.enableOrDisableForm();

        if (eventData.data['units'] !== this.noOfUnitsInStep1) {
          this.noOfUnitsInStep1 = eventData.data['units'];
          if (this.showSingleReplicaLayout) {
           this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
          }
        }

        if (eventData.data['property_type'] !== this.propertyTypeStep1) {
          this.resetLayoutIfPropertyTypeChanged(eventData.data['property_type']);
          this.propertyTypeStep1 = eventData.data['property_type'];
        }

        this.showSingleReplicaLayout =
          eventData.data['property_type'] === '5+ Units';
        if (
          eventData.data['units'] != null && !this.dataToFillInForms?.property_economics?.property_units?.length
        ) {
          this.replicasToShow = eventData.data['units'] > 4 ? this.maxPossibleReplicas : eventData.data['units'];
          this.mapOfCounter.clear();
          this.counter = 0;
          this.propertyEconomicsInputForm.setControl('multiReplicaLayout', this.fb.array([]));
          for (let i = 0; i < this.replicasToShow || 0; i++) {
            (<FormArray>(
              this.propertyEconomicsInputForm.get('multiReplicaLayout')
            )).push(
              this.fb.group({
                market_rent: 0,
                in_place_rent: 0,
                sq_ft: 0,
                lease_type: 'Long Term'
              })
            );
            
            this.mapOfCounter.set(`${i}0`, this.counter++);
            this.mapOfCounter.set(`${i}1`, this.counter++);
            this.mapOfCounter.set(`${i}2`, this.counter++);
            this.mapOfCounter.set(`${i}3`, this.counter++);
          }
        }
      }

      if (eventData.key === 'step2' && eventData.data['loan_amount']) {
        this.loanAmountInStep2 = eventData.data['loan_amount'] || 0;
        this.annualHoiInStep2 = eventData.data['annual_hoi'] || 0;
        this.annualTaxesInStep2 = eventData.data['annual_taxes'] || 0;

        if (this.loanAmountInStep2 && this.noOfUnitsInStep1)
          this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
      }
    });

    this.propertyEconomicsInputForm.valueChanges.pipe(startWith(null), pairwise()).subscribe(([formChagesPrev, formChanges]: [any, any]) => {
      this.formsService.dataChangeEmitter.next({
        key: this.showSingleReplicaLayout
          ? 'property_economics_single_ltr'
          : 'property_economics_multi',
        //@ts-ignore
        data: this.showSingleReplicaLayout
          ? this.getDataToEmit(formChanges)
          : [...this.getDataToEmit(formChanges)],
      });

      if (this.showSingleReplicaLayout &&
         (formChagesPrev?.['singleReplicaLayout']?.['gross_rent'] !== formChanges?.['singleReplicaLayout']?.['gross_rent'])) {
        this.updateSingleReplicaPropertyEconomicsFieldsLtr(this.loanAmountInStep2, this.noOfUnitsInStep1);
      }
    });

    this.propertyEconomicsInputFormNonLtr.valueChanges.subscribe(
      (formChanges) => {
        if (this.tabNameSelected !== "LTR")
          this.formsService.dataChangeEmitter.next({
            key: 'property_economics_single',
            data: this.getDataToEmitForNonLtr(formChanges),
          });
      }
    );
    this.enableOrDisableForm();

    this.propertyEconomicsInputFormNonLtr.statusChanges.subscribe((status) => {
      if (this.tabNameSelected !== 'LTR')
        this.formsService.statusChangeEmitter.next({
          key: 'property_economics',
          status: this.getStatus(),
        });
    });

    this.propertyEconomicsInputForm.statusChanges.subscribe((status) => {
      if (this.tabNameSelected === 'LTR')
        this.formsService.statusChangeEmitter.next({
          key: 'property_economics',
          status: this.getStatus(),
        });
    });
  }

  getDataToEmitForNonLtr(formChanges: any) {
    return {
      exit_strategy: formChanges['exit_strategy'],
      profitability_amount: formChanges['profitability_amount'],
      profitability_percent: formChanges['profitability_percent'],
      mf_gross_rents: formChanges['gross_rent'],
    };
  }

  getDataToEmit(formChanges: any) {
    if (!this.showSingleReplicaLayout) {
      const dataToReturn = [];
      for (let i = 0; i < this.replicasToShow; i++) {
        dataToReturn.push({
          unit_number: i + 1,
          ...formChanges.multiReplicaLayout[i]
        });
      }
      return dataToReturn;
    } else if (this.showSingleReplicaLayout) {
      return {
        mf_gross_rents: formChanges['singleReplicaLayout']?.['gross_rent'] ?? 0,
        mf_expense_ratio:
          formChanges['singleReplicaLayout']?.['expense-ratio-amount'] ?? 0,
        mf_reserves: formChanges['singleReplicaLayout']?.['reserves'] ?? 0,
        mf_noi: formChanges['singleReplicaLayout']?.['noi'] ?? 0,
      };
    }
    return [];
  }

  getClassToApply() {
    if (!this.isToggled) return 'width160Px';
    return 'width105Px';
  }

  getControls() {
    return (
      this.propertyEconomicsInputForm.get('multiReplicaLayout') as FormArray
    ).controls;
  }

  getName(i: string) {
    return this.mapOfCounter.get(i);
  }

  enableOrDisableForm() {
    if (this.disableDiv) {
      this.propertyEconomicsInputForm.disable();
      this.propertyEconomicsInputFormNonLtr.disable();
    } else {
      this.propertyEconomicsInputForm.enable();
      this.propertyEconomicsInputFormNonLtr.enable();
    }
  }

  getStatus() {
    let isValid = false;

    if (this.tabNameSelected === 'LTR') {
      const formValue = this.propertyEconomicsInputForm.value;
      if (this.showSingleReplicaLayout) {
        isValid =
          formValue.singleReplicaLayout.gross_rent &&
          formValue.singleReplicaLayout['expense-ratio-amount'] &&
          formValue.singleReplicaLayout.reserves &&
          formValue.singleReplicaLayout.noi;
      } else {
        let controlsAvailable = this.getControls();
        const isInvalidGroupFound = controlsAvailable?.findIndex((singleFormGroup) => singleFormGroup.status !== "VALID");
        isValid = (isInvalidGroupFound === -1);
      }
    } else {
      isValid = this.propertyEconomicsInputFormNonLtr.valid;
    }

    return isValid ? 'VALID' : 'INVALID';
  }

  updateSingleReplicaPropertyEconomicsFieldsLtr(loanAmountInStep2: number = 0, noOfUnitsInStep1: number = 0) {
    let grossRent = this.propertyEconomicsInputForm.get('singleReplicaLayout')?.value['gross_rent'] || 0;
    let expenseRatio = 0, reserves = 0, noi = 0;

    if (loanAmountInStep2 / noOfUnitsInStep1 < 100000) {
      expenseRatio = grossRent * 0.35;
    }
    else if (loanAmountInStep2 / noOfUnitsInStep1 > 250000) {
      expenseRatio = grossRent * 0.15;
    }
    else {
      expenseRatio = grossRent * 0.25;
    }
    reserves = noOfUnitsInStep1 * 300;
    noi = grossRent - this.annualTaxesInStep2 - this.annualHoiInStep2 - expenseRatio - reserves;
    
    this.propertyEconomicsInputForm.get('singleReplicaLayout')?.patchValue({
      'expense-ratio-amount': Math.round((expenseRatio + Number.EPSILON) * 100) / 100,
      reserves: Math.round((reserves + Number.EPSILON) * 100) / 100,
      noi: Math.round((noi + Number.EPSILON) * 100) / 100
    });
  }

  resetLayoutIfPropertyTypeChanged(type: string) {
    if (this.propertyTypeStep1 !== type) {
      this.propertyEconomicsInputForm.setControl('multiReplicaLayout', this.fb.array([]));
    }
  }

  getAllControls() {
    return (this.propertyEconomicsInputForm.get('multiReplicaLayout') as FormArray)?.['controls'];
  }
}
