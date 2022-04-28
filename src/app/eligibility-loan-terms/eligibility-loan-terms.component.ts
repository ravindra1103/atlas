import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormService } from '../shared/form.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eligibility-loan-terms',
  templateUrl: './eligibility-loan-terms.component.html',
  styleUrls: ['./eligibility-loan-terms.component.scss'],
})
export class EligibilityLoanTermsComponent implements OnInit, OnChanges {
  tabsToShow: string[] = ['Eligibility', 'Messages'];
  dataToLoad: any = [];
  messageToLoad: any = [];
  dataToLoadTab2: any = [];
  selectedTabIndex: number = 0;
  displayedColumns: string[] = [
    'fico_range',
    'purchase',
    'rate_term',
    'cashout',
  ];
  displayedColumnsRehab: string[] = [
    'experience',
    'ltarv',
    'ltv',
    'rehab_level',
  ];
  displayedColumnsTab2: string[] = ['message'];
  apiResponse: any;
  maxLtvSelectedPercent: any = 0;

  @Input()
  tabNameSelected: string = 'LTR';

  @Input() messages: any;

  constructor(private http: HttpClient, private formsService: FormService) { }

  ngOnInit(): void {
    this.messageToLoad.push(
      'FICO Score Should Be More Than 600',
      'FICO-2 Score Should Be More Than 600'
    );

    this.dataToLoadTab2.push(
      {
        message: 'Credit Score is below the minimum for this product',
      },
      {
        message: 'DSCR is less than minimum allowed for all rates',
      },
      {
        message: 'Everything looks good.',
      }
    );

    this.http
      .get(
        `${environment.apiUrl}/ConfigureEligibility`
      )
      .subscribe((response: any) => {
        if (Object.keys(response)?.length) {
          this.dataToLoad = response[this.tabNameSelected] || [];
          this.apiResponse = response;
          localStorage.setItem('ConfigureEligibility', JSON.stringify(response));
        }
      });

    this.formsService.dataChangeEmitter.subscribe((eventData: any) => {
      if (eventData.key === 'step1') {
        const ficoValueEntered = eventData.data['fico'];
        const loanpurpose = eventData.data['loan_purpose'];
        this.getHighLightColumn(ficoValueEntered, loanpurpose);
      }
    });
  }

  getHighLightColumn(fico: string, loanPurpose: string) {
    localStorage.setItem('maxLtvSelectedPercent', '0');
    let singleRow, nums;
    for (let i = 0; i < this.dataToLoad?.length || 0; i++) {
      singleRow = this.dataToLoad[i];
      nums = singleRow['fico_range']?.split('-');
      singleRow['highlight'] = {};
      let attrNameToUse = this.getAttrName(loanPurpose);

      if (nums[0] <= fico && nums[1] >= fico) {
        singleRow['highlight']['highlight' + attrNameToUse] = true;
        this.maxLtvSelectedPercent = singleRow[attrNameToUse];
        localStorage.setItem('maxLtvSelectedPercent', singleRow[attrNameToUse]);
      }
      else {
        singleRow['highlight']['highlight' + attrNameToUse] = false;
        this.maxLtvSelectedPercent = 0;
      }
    }
  }

  ngOnChanges() {
    if (this.apiResponse)
      this.dataToLoad = this.apiResponse[this.tabNameSelected];
  }

  onTabChange(tabValue: number) {
    this.selectedTabIndex = tabValue;
  }

  getAttrName(purpose: string) {
    switch (purpose) {
      case 'Purchase':
        return 'purchase';
      case 'Delayed Purchase':
        return 'purchase';
      case 'Rate/Term':
        return 'rate_term';
      case 'Cash Out':
        return 'cashout';
      default:
        return '';
    }
  }
}
