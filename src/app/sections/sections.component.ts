import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { data as savedData } from '../data/ui-metadata';
import { FormService } from '../shared/form.service';
import { SingleSectionName, SingleSectionTab } from '../shared/interfaces';
import { environment } from 'src/environments/environment';

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
  calculatedValues: any = {
    ltv: '-',
    propertyValue: '-',
    maxLoanAmount: '-',
    tiAmount: '-'
  };
  activatedSub: Subscription = {} as Subscription;
  rateStackResponseReceived: any;

  @Input()
  isToggled: boolean = false;

  rowToPass: any = {};

  dataToFillInForms: any = {};

  constructor(private http: HttpClient, private formsService: FormService) {}

  ngOnInit(): void {
    this.sections = [
      { key: 'ltr', labelValue: 'LTR' },
      { key: 'bridgeLoan', labelValue: 'Bridge Loan' },
      { key: 'rehab', labelValue: 'Rehab' },
    ];

    this.tabDataToDisplay = this.getTabDataByIndex(0);

    this.activatedSub = this.formsService.dataChangeEmitter.subscribe(
      (changesReceived) => {
        if (changesReceived?.key !== 'property_enomomics_multi') {
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
  }

  onTabChange(event: number) {
    this.tabDataToDisplay = this.getTabDataByIndex(event);
    this.tabNameSelected = this.sections[event].labelValue;
  }

  getTabDataByIndex(index: number = 0): SingleSectionTab {
    return this.data[index];
  }

  typeChanged(selectedLoanText: any) {
    this.typeSelected =
      this.typesOfLoan.find(
        (loan) => loan.toLowerCase() === selectedLoanText.value.toLowerCase()
      ) || '';

    if (this.typeSelected === 'New Loan') {
      console.log("came here");
      this.atlasId = '';
      this.dataToFillInForms = {};
    }
  }

  getPricingById() {
    if (this.atlasId) {
      this.http
        .get(
          `${environment.apiUrl}/Price/GetLoanInputs/${this.atlasId}`
        )
        .subscribe((response: any) => {
          this.dataToFillInForms = response;
        });
    }
    if (!this.atlasId && this.typeSelected === 'New Loan') {
      this.http
        .post(`${environment.apiUrl}/Price/GetPrice`, {
          ...this.formDataEnteredByUser,
        })
        .subscribe((response: any) => {
          this.rateStackResponseReceived = response;
        });
    }
  }

  ngOnDestroy(): void {
    this.activatedSub?.unsubscribe();
  }

  onRowToPass(data: any) {
    console.log(this.rateStackResponseReceived);
    console.log(this.formDataEnteredByUser);
    this.rowToPass = data;
    console.log(this.rowToPass);
    const { input : { loan_inputs : {
      appraised_value,
      purchase_price,
      loan_amount,
      annual_hoi,
      annual_taxes
    }}} = this.formDataEnteredByUser;
    const maxLtvSelectedPercentValue = localStorage.getItem('maxLtvSelectedPercent');
    let maxLtvSelectedPercent = 0;
    const value = maxLtvSelectedPercentValue?.slice(0, -1);
    if (value) {
      maxLtvSelectedPercent = +value;
    }
    let propertyValue = Math.min(appraised_value, purchase_price);
    this.calculatedValues = {
      ltv: loan_amount*1.0/propertyValue,
      propertyValue,
      maxLoanAmount: maxLtvSelectedPercent * propertyValue,
      tiAmount: ((annual_taxes * 1.0) + annual_hoi)/12
    };
  }
}
