import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  formLabel: string = 'Property Economics';
  propertyEconomicsInputForm: FormGroup = {} as FormGroup;
  propertyEconomicsInputFormNonLtr: FormGroup = {} as FormGroup;

  exitStrategy = ['Hold', 'Sell'];
  leaseTypes = ['Long Term', 'Short Term', 'Unoccupied'];
  replicasToShow: number = 0;
  showSingleReplicaLayout = false;
  counter = 0;
  mapOfCounter = new Map();

  constructor(private formsService: FormService) {}

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
      this.propertyEconomicsInputForm.reset();
      if (!this.showSingleReplicaLayout) {
        this.counter = 0;
        (<FormArray>(
          this.propertyEconomicsInputForm.get('multiReplicaLayout')
        )).clear();
        for (let i = 0; i < this.replicasToShow || 0; i++) {
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).push(
            new FormControl(
              this.dataToFillInForms.property_economics.property_units[
                i
              ].market_rent
            )
          );
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).push(
            new FormControl(
              this.dataToFillInForms.property_economics.property_units[
                i
              ].in_place_rent
            )
          );
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).push(
            new FormControl(
              this.dataToFillInForms.property_economics.property_units[i].sq_ft
            )
          );
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).push(
            new FormControl(
              this.dataToFillInForms.property_economics.property_units[
                i
              ].lease_type
            )
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
    }
  }

  ngOnInit(): void {
    this.propertyEconomicsInputForm = new FormGroup({
      singleReplicaLayout: new FormGroup({
        gross_rent: new FormControl(null),
        'expense-ratio-amount': new FormControl(null),
        reserves: new FormControl(null),
        noi: new FormControl(null),
      }),
      multiReplicaLayout: new FormArray([]),
    });

    this.propertyEconomicsInputFormNonLtr = new FormGroup({
      exit_strategy: new FormControl('Hold'),
      gross_rent: new FormControl(null),
      profitability_amount: new FormControl(null),
      profitability_percent: new FormControl(null),
    });

    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        this.disableDiv =
          !eventData.data['fico'] || !eventData.data['appraised_value'];

        this.showSingleReplicaLayout =
          eventData.data['property_type'] === '5+ Units';
        if (
          eventData.data['units'] != null &&
          this.replicasToShow !== eventData.data['units']
        ) {
          this.replicasToShow = eventData.data['units'];
          (<FormArray>(
            this.propertyEconomicsInputForm.get('multiReplicaLayout')
          )).clear();

          this.counter = 0;
          for (let i = 0; i < this.replicasToShow || 0; i++) {
            (<FormArray>(
              this.propertyEconomicsInputForm.get('multiReplicaLayout')
            )).push(new FormControl(null));
            (<FormArray>(
              this.propertyEconomicsInputForm.get('multiReplicaLayout')
            )).push(new FormControl(null));
            (<FormArray>(
              this.propertyEconomicsInputForm.get('multiReplicaLayout')
            )).push(new FormControl(null));
            (<FormArray>(
              this.propertyEconomicsInputForm.get('multiReplicaLayout')
            )).push(new FormControl('Long Term'));
            this.mapOfCounter.set(`${i}0`, this.counter++);
            this.mapOfCounter.set(`${i}1`, this.counter++);
            this.mapOfCounter.set(`${i}2`, this.counter++);
            this.mapOfCounter.set(`${i}3`, this.counter++);
          }
        }
      }
    });

    if (this.tabNameSelected === 'LTR')
      this.propertyEconomicsInputForm.valueChanges.subscribe((formChanges) => {
        this.formsService.dataChangeEmitter.next({
          key: 'property_enomomics_multi',
          //@ts-ignore
          data: [...this.getDataToEmit(formChanges)],
        });
      });
    else
      this.propertyEconomicsInputFormNonLtr.valueChanges.subscribe(
        (formChanges) => {
          this.formsService.dataChangeEmitter.next({
            key: 'property_enomomics_single',
            data: { ...this.getDataToEmit(formChanges) },
          });
        }
      );
  }

  getDataToEmit(formChanges: any) {
    if (!this.showSingleReplicaLayout) {
      const dataToReturn = [
        ...(this.dataToFillInForms?.property_economics?.property_units || []),
      ];
      let count = 0;
      for (let i = 0; i < this.replicasToShow; i++) {
        dataToReturn.push({
          unit_number: i,
          market_rent: formChanges['multiReplicaLayout'][count++],
          in_place_rent: formChanges['multiReplicaLayout'][count++],
          sq_ft: formChanges['multiReplicaLayout'][count++],
          lease_type: formChanges['multiReplicaLayout'][count++],
        });
      }
      return dataToReturn;
    } else if (this.showSingleReplicaLayout) {
      return {
        mf_gross_rents: formChanges['singleReplicaLayout']['gross_rent'],
        mf_expense_ratio:
          formChanges['singleReplicaLayout']['expense-ratio-amount'],
        mf_reserves: formChanges['singleReplicaLayout']['reserves'],
        mf_noi: formChanges['singleReplicaLayout']['noi'],
      };
    }
    return {};
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
}
