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
  approvalCode: '-',
  totalPoints: '-',
  totalClosingCost: '-'
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
  selectedRow: any = {};
  activatedSub: Subscription = {} as Subscription;
  activatedSubStatus: Subscription = {} as Subscription;
  rateStackResponseReceived: any;
  dataUpdated = false;
  isGetApiResponseReceived = false;

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
        this.filterFormDataBasedCurrentState();
        //console.log('formDataEnteredByUser - ', this.formDataEnteredByUser);
      }
    );

    this.activatedSubStatus = this.formsService.statusChangeEmitter.subscribe(
      (statusChanges) => {
        if (this.typeSelected === 'New Loan' || this.isGetApiResponseReceived) {
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
    this.isGetApiResponseReceived = false;
    this.onAtlasIdChange();
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
    this.selectedRow = {};
    this.isGetApiResponseReceived = false;

    if (this.typeSelected === 'New Loan') {
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
          this.isGetApiResponseReceived = true;
        });
      return;
    }
    // if (!this.atlasId && this.typeSelected === 'New Loan') {
    const { input: { property_economics, loan_inputs: { loan_amount, appraised_value, purchase_price, annual_taxes, annual_hoi, annual_other, exit_strategy, property_type, mf_expense_ratio, mf_gross_rents, mf_noi, mf_reserves } } } = this.formDataEnteredByUser;
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
    let property_value = appraised_value;
    if (purchase_price > 0) {
      property_value = Math.min(appraised_value, purchase_price);
    }
    this.formDataEnteredByUser.input.loan_inputs = {
      ...this.formDataEnteredByUser.input.loan_inputs,
      LTV: loan_amount / property_value,
      loan_amount: Math.ceil(loan_amount),
      TI: (annual_taxes + annual_hoi) / 12,
      TIA: (annual_taxes + annual_hoi + annual_other) / 12,
      ARV: 0,
      ILTV: 0,
      LTC: 0,
      LTARV: 0,
      property_value: property_value,
      exit_strategy: this.tabNameSelected === 'LTR' ? null : exit_strategy,
      mf_expense_ratio: property_type !== '5+ Units' ? null : mf_expense_ratio,
      mf_gross_rents: property_type !== '5+ Units' ? null : mf_gross_rents,
      mf_noi: property_type !== '5+ Units' ? null : mf_noi,
      mf_reserves: property_type !== '5+ Units' ? null : mf_reserves,
    }

    if (property_type === '5+ Units') {
      this.formDataEnteredByUser.input.property_economics = { property_units: [] };
    }

    if (this.atlasId) {
      this.formDataEnteredByUser.input.loan_inputs.atlas_id = this.atlasId;
    }
    this.http
      .post(`${environment.apiUrl}/Price/GetPrice`, {
        ...this.formDataEnteredByUser,
      })
      .subscribe((response: any) => {
        this.rateStackResponseReceived = response;
      });
  }

  ngOnDestroy(): void {
    this.activatedSub?.unsubscribe();
    this.activatedSubStatus?.unsubscribe();
  }

  onAtlasIdChange(): void {
    this.dataToFillInForms = {};
    this.calculatedValues = DEFAULT_CALCULATED_VALUES;
    this.selectedRow = {};
    this.dataUpdated = false;
    this.isGetApiResponseReceived = false;
    this.enablePricingButton = true;
    this.rateStackResponseReceived = [];
  }

  onRowToPass(data: any) {
    // console.log(this.rateStackResponseReceived);
    // console.log(this.formDataEnteredByUser);
    // console.log(data);
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
    let propertyValue = appraised_value;
    if (purchase_price > 0) {
      propertyValue = Math.min(appraised_value, purchase_price);
    }
    const totalPoints =((broker_points + origination_points) * loan_amount*1.0)/ 100;
    const totalCost = (((broker_points + origination_points) * loan_amount*1.0)/ 100) + other_costs + (disc || 0);
    const totalClosingCost = (((broker_points + origination_points) * loan_amount*1.0)/ 100) + other_costs;
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
      approvalCode: approval_code,
      total_points: ((broker_points + origination_points) * loan_amount),
      totalClosingCost,
      totalPoints
    };
    this.selectedRow = data;
  }

  onLockRate(): void {
    this.http
      .post(`${environment.apiUrl}/Rate/LockRate`, {
        "atlas_id": this.selectedRow.atlas_id,
        "run_id": this.selectedRow.run_id,
        rate_data: {
          "rate": this.selectedRow.rate,
          "dscr": this.selectedRow.dscr,
          "piti": this.selectedRow.piti,
          "price": this.selectedRow.price,
          "disc": this.selectedRow.disc,
          "is_par": this.selectedRow.is_par,
          "max_ltv": this.selectedRow.max_ltv,
          "min_dscr": this.selectedRow.min_dscr,
          "messages": this.selectedRow.messages,
          "approval_code": this.selectedRow.approval_code,
          "io_dscr": this.selectedRow.io_dscr,
          "io_piti": this.selectedRow.io_piti,
          "io_price": this.selectedRow.io_price,
          "io_disc": this.selectedRow.io_disc,
          "io_is_par": this.selectedRow.io_is_par,
          "io_max_ltv": this.selectedRow.io_max_ltv,
          "io_min_dscr": this.selectedRow.io_min_dscr,
          "io_messages": this.selectedRow.io_messages,
          "io_approval_code": this.selectedRow.io_approval_code,
          "rate_sheet_id": this.selectedRow.rate_sheet_id,
        },
        loan_terms:
        {
          "loan_purpose": this.calculatedValues.loan_purpose,
          "loan_amount": this.calculatedValues.loan_amount,
          "fico": this.calculatedValues.fico,
          "property_type": this.calculatedValues.property_type,
          "property_value": +this.calculatedValues.propertyValue,
          "gross_rents": this.calculatedValues.totalRents,
          "LTV": +this.calculatedValues.ltv,
          "rate": +this.selectedRow.rate,
          "cash_to_from": this.selectedRow.cashTo,
          "DSCR": this.selectedRow.dscr,
          "PITI": this.selectedRow.piti,
          "DiscPrem": this.selectedRow.disc_prem,
          "total_cost": this.calculatedValues.totalCost
        },
        calculated_values: {  
          "LTV": +this.calculatedValues.ltv,
          "max_loan_amount": +this.calculatedValues.maxLoanAmount,
          "total_points": +this.calculatedValues.total_points,
          "property_value": +this.calculatedValues.propertyValue,
          "TI_amount": +this.calculatedValues.tiAmount,
          "total_closing_costs": Math.ceil(this.calculatedValues.totalCost),
        }
      })
      .subscribe((response: any) => {
        this.rateStackResponseReceived = response;
      });
  }

  formUpdated() {
    this.dataUpdated = true;
  }

  filterFormDataBasedCurrentState() {
    this.omitValuesStep1();
    this.omitValuesStep2();
    this.omitValuesPropertyEconomics();
    if (this.formDataEnteredByUser?.input?.loan_inputs?.other_costs) {
      this.formDataEnteredByUser.input.loan_inputs.other_costs = (this.formDataEnteredByUser.input.loan_inputs.other_costs | 0);
    }
    if (this.formDataEnteredByUser?.input?.loan_inputs?.loan_amount) {
      this.formDataEnteredByUser.input.loan_inputs.loan_amount = (this.formDataEnteredByUser.input.loan_inputs.loan_amount | 0);
    }
  }

  omitValuesStep1() {
    const formsValue = this.formDataEnteredByUser?.input?.loan_inputs;
    
    if (Object.keys(formsValue || {}).length === 0)
      return ;
    
    if (
      formsValue.loan_purpose === 'Purchase' ||
      formsValue.loan_purpose === 'Delayed Purchase'
    ) {
      delete formsValue?.upb;

      if (formsValue.loan_purpose === 'Purchase')
        delete formsValue?.acquisition_date;
    } else if (
      formsValue.loan_purpose === 'Rate/Term' ||
      formsValue.loan_purpose === 'Cash Out'
    ) {
      delete formsValue?.purchase_price;
    }

    if (this.tabNameSelected !== 'Rehab') {
      delete formsValue?.rehab_amount;
      delete formsValue?.arv;
    }
  }

  omitValuesStep2() {
    const formsValue = this.formDataEnteredByUser?.input?.loan_inputs;

    if (Object.keys(formsValue || {}).length === 0)
      return ;
      
    if (this.tabNameSelected === 'Rehab') {
      delete formsValue?.units;
      delete formsValue?.zip_code;
    }
    // else {
    //   delete formsValue?.ppp_type;
    //   delete formsValue?.ppp_term;
    // }
  }

  omitValuesPropertyEconomics() {
    const formsValue = this.formDataEnteredByUser?.input?.loan_inputs;

    if (Object.keys(formsValue || {}).length === 0)
      return ;

    if (formsValue.property_type !== "5+ Units" || this.tabNameSelected !== 'LTR') {
      delete formsValue?.mf_expense_ratio;
      // delete formsValue?.mf_gross_rents;
      delete formsValue?.mf_noi;
      delete formsValue?.mf_reserves;
    }
    
    if  ((formsValue.property_type === "5+ Units" &&
                this.formDataEnteredByUser?.input?.property_economics?.property_units?.length)
                 || this.tabNameSelected !== 'LTR') {
        this.formDataEnteredByUser.input.property_economics.property_units = [];
    }

    if (formsValue.property_type !== "5+ Units" && this.tabNameSelected === "LTR") {
      delete formsValue?.mf_gross_rents;
    }
    if (this.tabNameSelected === "LTR") {
      delete formsValue?.exit_strategy;
      delete formsValue?.profitability_amount;
      delete formsValue?.profitability_percent;
    }
  }
}
