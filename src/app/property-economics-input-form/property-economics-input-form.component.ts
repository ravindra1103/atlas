import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
  disabledDiv?: boolean = false;

  @Input()
  dataToFillInForms: any = {};

  formLabel: string = 'Property Economics';
  propertyEconomicsInputForm: FormGroup = {} as FormGroup;
  propertyEconomicsInputFormNonLtr: FormGroup = {} as FormGroup;

  exitStrategy = ['Hold', 'Sell'];
  leaseTypes = ['Long Term', 'Short Term', 'Unoccupied'];
  disableDiv:boolean = true;
  replicasToShow: number = 1;
  showSingleReplicaLayout = false;

  constructor(private formsService: FormService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tabNameSelected === 'LTR') {
      this.populateFormIfDataAvailableLtr();
    } else {
      this.populateFormIfDataAvailableNonLtr();
    }
  }

  populateFormIfDataAvailableLtr() {
    if (Object.keys(this.dataToFillInForms).length)
      this.propertyEconomicsInputForm.setValue({
        market_rent:
          this.dataToFillInForms.property_economics.property_units[0][
            'market_rent'
          ],
        in_place_rent:
          this.dataToFillInForms.property_economics.property_units[0][
            'in_place_rent'
          ],
        sq_ft:
          this.dataToFillInForms.property_economics.property_units[0]['sq_ft'],
        lease_type:
          this.dataToFillInForms.property_economics.property_units[0][
            'lease_type'
          ],
      });
  }

  populateFormIfDataAvailableNonLtr() {
    if (Object.keys(this.dataToFillInForms).length)
      this.propertyEconomicsInputFormNonLtr.setValue({
        exit_strategy: this.dataToFillInForms.loan_inputs['exit_strategy'],
        gross_rent: this.dataToFillInForms.loan_inputs['mf_gross_rents'],
        profitability_amount:
          this.dataToFillInForms.loan_inputs['profitability_amount'],
        profitability_percent:
          this.dataToFillInForms.loan_inputs['profitability_percent'],
      });
  }

  // market_rent: new FormControl(null),
  //       in_place_rent: new FormControl(null),
  //       sq_ft: new FormControl(null),
  //       lease_type: new FormControl('Long Term'),

  ngOnInit(): void {
    this.propertyEconomicsInputForm = new FormGroup({
      'singleReplicaLayout': new FormGroup ({
        'gross_rent': new FormControl(null),
        'expense-ratio-amount': new FormControl(null),
        'reserves': new FormControl(null),
        'noi': new FormControl(null),
      }),
      'multiReplicaLayout': new FormArray([])
    });

    this.propertyEconomicsInputFormNonLtr = new FormGroup({
      exit_strategy: new FormControl('Hold'),
      gross_rent: new FormControl(null),
      profitability_amount: new FormControl(null),
      profitability_percent: new FormControl(null),
    });

    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        this.disableDiv = !eventData.data['fico'] ||  !eventData.data['appraised_value'];

        this.showSingleReplicaLayout = eventData.data['property_type'] !== '5+ Units';
        this.replicasToShow = eventData.data['units'];

        (<FormArray>this.propertyEconomicsInputForm.get('singleReplicaLayout')).clear();
        for (let i=0; i<this.replicasToShow || 0; i++) {
          const control = new FormControl(null);
          (<FormArray>this.propertyEconomicsInputForm.get('singleReplicaLayout')).push(control);
        }
      }
    });

    if (this.tabNameSelected === 'LTR')
      this.propertyEconomicsInputForm.valueChanges.subscribe((formChanges) => {
        this.formsService.dataChangeEmitter.next({
          key: 'property_enomomics',
          data: [{ unit_number: 1, ...formChanges,}]
        });
      });
    else
      this.propertyEconomicsInputFormNonLtr.valueChanges.subscribe(
        (formChanges) => {
          this.formsService.dataChangeEmitter.next({
            key: 'property_enomomics',
            data: [{ unit_number: 1, ...formChanges}]
          });
        }
      );
  }

  getExtraFields() {
    return {};
  }

  getClassToApply() {
    if (!this.isToggled) return 'width160Px';
    return 'width105Px';
  }

  getControls() {
    return (this.propertyEconomicsInputForm.get('multiReplicaLayout') as FormArray).controls;
  }
}
