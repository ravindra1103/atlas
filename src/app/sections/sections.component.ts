import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { data as savedData } from '../data/ui-metadata';
import { FormService } from '../shared/form.service';
import { SingleSectionName, SingleSectionTab } from '../shared/interfaces';
import { environment } from 'src/environments/environment';

const DEFAULT_CALCULATED_VALUES = {
  ltv: '-',
  propertyValue: '-',
  maxLoanAmount: '-',
  tiAmount: '-',
  loanPurpose: '-',
  loan_amount: '-',
  rate: '-',
  fico: '-',
  dscr: '-',
  property_type: '-',
  piti: '-',
  disc: '-',
  totalRents: '-',
  totalCost: '-',
  cashTo: '-',
  approvalCode: '-'
}
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent implements OnInit {
  sections: SingleSectionName[] = [];
  selectedTab: number = 0;
  tabDataToDisplay: SingleSectionTab = {} as SingleSectionTab;
  typesOfLoan: string[] = ['New Loan', 'Existing Loan'];
  typeSelected: string = this.typesOfLoan[0];
  atlasId: any;
  data: any = [...savedData];
  tabNameSelected: string = 'LTR';
  formDataEnteredByUser: any = {} as any;
  messages: any = '';
  calculatedValues: any = DEFAULT_CALCULATED_VALUES;
  activatedSub: Subscription = {} as Subscription;
  activatedSubStatus: Subscription = {} as Subscription;
  rateStackResponseReceived: any;
  dataUpdated = false;

  @Input()
  isToggled: boolean = false;

  rowToPass: any = {};

  dataToFillInForms: any = {};

  enablePricingButton: boolean = false;

  aggregatedStatus: any = {};

  constructor(private http: HttpClient, private formsService: FormService) { }

  ngOnInit(): void {
    this.sections = [
      { key: 'ltr', labelValue: 'LTR' },
      { key: 'bridgeLoan', labelValue: 'Bridge Loan' },
      { key: 'rehab', labelValue: 'Rehab' },
    ];

    this.tabDataToDisplay = this.getTabDataByIndex(0);

    this.activatedSub = this.formsService.dataChangeEmitter.subscribe(
      (changesReceived) => {

        if (changesReceived?.key !== 'property_economics_multi') {
          this.formDataEnteredByUser = {
            input: {
              loan_inputs: {
                product_type: this.tabNameSelected,
                ...(this.formDataEnteredByUser?.input?.loan_inputs || {}),
                ...changesReceived['data'],
              },
              property_economics: {
                ...(this.formDataEnteredByUser.input?.property_economics || {}),
              },
            },
          };
        } else {
          this.formDataEnteredByUser = {
            input: {
              ...this.formDataEnteredByUser.input,
              property_economics: {
                property_units: [...changesReceived['data']],
              },
            },
          };
        }
      }
    );

    this.activatedSubStatus = this.formsService.statusChangeEmitter.subscribe(
      (statusChanges) => {
        if (this.typeSelected === 'New Loan') {
          this.aggregatedStatus = {
            ...this.aggregatedStatus,
            [statusChanges['key']]: statusChanges['status'],
          };
          this.enablePricingButton =
            this.aggregatedStatus['step1'] === 'VALID' &&
            this.aggregatedStatus['step2'] === 'VALID' &&
            this.aggregatedStatus['property_economics'] === 'VALID';
        }
      }
    );
  }

  onTabChange(event: number) {
    this.tabDataToDisplay = this.getTabDataByIndex(event);
    this.tabNameSelected = this.sections[event].labelValue;
    if (this.typeSelected === 'New Loan')
      this.enablePricingButton = false;
  }

  getTabDataByIndex(index: number = 0): SingleSectionTab {
    return this.data[index];
  }

  typeChanged(selectedLoanText: any) {
    this.typeSelected =
      this.typesOfLoan.find(
        (loan) => loan.toLowerCase() === selectedLoanText.value.toLowerCase()
      ) || '';

    this.rateStackResponseReceived = [];
    this.dataUpdated = false;

    if (this.typeSelected === 'New Loan') {
      console.log('came here');
      this.atlasId = '';
      this.dataToFillInForms = {};
      this.enablePricingButton = false;
    }
    else {
      this.enablePricingButton = true;
      this.dataToFillInForms = {};
      this.calculatedValues = DEFAULT_CALCULATED_VALUES;
    }
  }

  getPricingById() {
    if (this.atlasId && !this.dataUpdated) {
      this.http
        .get(`${environment.apiUrl}/Price/GetLoanInputs/${this.atlasId}`)
        .subscribe((response: any) => {
          this.dataToFillInForms = response;
        });
      return;
    }
    // if (!this.atlasId && this.typeSelected === 'New Loan') {
    const { input: { property_economics, loan_inputs: { loan_amount, appraised_value, purchase_price, annual_taxes, annual_hoi, annual_other } } } = this.formDataEnteredByUser;
    // let mf_gross_rents = 0;
    // if (property_economics?.property_units?.length) {
    //   const initialValue = 0;
    //   mf_gross_rents = property_economics.property_units.reduce(
    //     (previousValue: any, currentValue: any) => {
    //       return currentValue?.market_rent + currentValue?.in_place_rent;
    //     },
    //     initialValue
    //   );
    // }
    this.formDataEnteredByUser.input.loan_inputs = {
      ...this.formDataEnteredByUser.input.loan_inputs,
      LTV: loan_amount / Math.min(appraised_value, purchase_price),
      TI: (annual_taxes + annual_hoi) / 12,
      TIA: (annual_taxes + annual_hoi + annual_other) / 12,
      ARV: 0,
      ILTV: 0,
      LTC: 0,
      LTARV: 0,
      // mf_gross_rents
    }

    if (this.atlasId) {
      this.formDataEnteredByUser.input.loan_inputs.atlasId = this.atlasId;
    }
    this.http
      .post(`${environment.apiUrl}/Price/GetPrice`, {
        ...this.formDataEnteredByUser,
      })
      .subscribe((response: any) => {
        this.rateStackResponseReceived = response;
      });
    // }
  }

  ngOnDestroy(): void {
    this.activatedSub?.unsubscribe();
    this.activatedSubStatus?.unsubscribe();
  }

  onAtlasIdChange(): void {
    this.dataToFillInForms = {};
    this.calculatedValues = DEFAULT_CALCULATED_VALUES;
    this.dataUpdated = false;
  }

  onRowToPass(data: any) {
    console.log(this.rateStackResponseReceived);
    console.log(this.formDataEnteredByUser);
    console.log(data);
    const {
      input: {
        loan_inputs: {
          appraised_value,
          purchase_price,
          loan_amount,
          annual_hoi,
          annual_taxes,
          loan_purpose,
          fico,
          property_type,
          broker_points = 0,
          origination_points = 0,
          other_costs = 0
        },
        property_economics: {
          property_units
        }
      },
    } = this.formDataEnteredByUser;
    const { rate, dscr, piti, disc_prem: disc, approval_code } = data;
    const maxLtvSelectedPercentValue = localStorage.getItem(
      'maxLtvSelectedPercent'
    );
    let maxLtvSelectedPercent = 0;
    const value = maxLtvSelectedPercentValue?.slice(0, -1);
    if (value) {
      maxLtvSelectedPercent = +value;
    }
    let propertyValue = Math.min(appraised_value, purchase_price);
    const totalCost = ((broker_points + origination_points) * loan_amount) + other_costs + (disc || 0);
    this.calculatedValues = {
      ltv: ((loan_amount * 1.0) / propertyValue).toFixed(2),
      propertyValue: (propertyValue * 1.0).toFixed(2),
      maxLoanAmount: (maxLtvSelectedPercent * propertyValue * 1.0 / 100).toFixed(2),
      tiAmount: ((annual_taxes * 1.0 + annual_hoi) / 12).toFixed(2),
      loan_purpose,
      loan_amount,
      rate,
      fico,
      dscr,
      property_type,
      piti,
      disc,
      totalRents: (property_units || []).reduce((acc: number, curr: { market_rent: number }) => (acc += curr.market_rent || 0), 0),
      totalCost: totalCost,
      cashTo: loan_amount - purchase_price - totalCost,
      approvalCode: approval_code
    };
  }
}
