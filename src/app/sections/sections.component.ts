import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { data as savedData } from '../data/ui-metadata';
import { FormService } from '../shared/form.service';
import { SingleSectionName, SingleSectionTab } from '../shared/interfaces';

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
  activatedSub: Subscription = {} as Subscription;
  rateStackResponseReceived: any;

  @Input()
  isToggled: boolean = false;

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
        console.log(
          'after receiving new event, formDataEnteredByUser:',
          this.formDataEnteredByUser
        );
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

    if (this.typeSelected === 'New Loan') this.atlasId = '';
  }

  getPricingById() {
    if (this.atlasId) {
      this.http
        .get(
          `https://pricingengineapi.azurewebsites.net/api/Price/GetLoanInputs/${this.atlasId}`
        )
        .subscribe((response: any) => {
          this.dataToFillInForms = response;
        });
    }
    if (!this.atlasId && this.typeSelected === 'New Loan') {
      this.http
        .post(`https://pricingengineapi.azurewebsites.net/api/Price/GetPrice`, {
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
}
