import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { data as savedData } from '../data/ui-metadata';
import { CommonConstants } from '../shared/constants';
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

  @Input()
  isToggled: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.sections = [
      { key: 'ltr', labelValue: 'LTR' },
      { key: 'bridgeLoan', labelValue: 'Bridge Loan' },
      { key: 'rehab', labelValue: 'Rehab' },
    ];

    this.tabDataToDisplay = this.getTabDataByIndex(0);
  }

  onTabChange(event: number) {
    this.tabDataToDisplay = this.getTabDataByIndex(event);
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
    console.log('atlasId', this.atlasId);
    this.http
      .get(
        `http://pricingengineapi.azurewebsites.net/api/Price/GetLoanInputs/${this.atlasId}`
      )
      .subscribe((response: any) => {
        const availableTabData = this.data.find(
          (singleDataObj: SingleSectionTab) =>
            singleDataObj.singleSectionName.labelValue ===
            response.loan_inputs.product_type
        );
        this.fillObjectWithApiValues(availableTabData, response);
      });
  }

  fillObjectWithApiValues(singleTabData: SingleSectionTab, response: any) {
    for (let singleInputFormToAccept of singleTabData.inputFormsToAccept) {
      for (let singleInputRecord of singleInputFormToAccept.inputRecordsToAccept) {
        if (singleInputRecord.type === CommonConstants.dropdownType)
        {
          if (singleInputFormToAccept.label === "Property Economics")
            singleInputRecord.selectedValueToBind = response.property_economics.property_units[0][singleInputRecord.keyToRead || ''];
          else
            singleInputRecord.selectedValueToBind =
              response.loan_inputs[singleInputRecord.keyToRead || ''];
        }
        else {
          if (singleInputFormToAccept.label === "Property Economics")
            singleInputRecord.valueToBind = response.property_economics.property_units[0][singleInputRecord.keyToRead || ''];
          else
          singleInputRecord.valueToBind =
            response.loan_inputs[singleInputRecord.keyToRead || ''];
        }
      }
    }
  }
}
