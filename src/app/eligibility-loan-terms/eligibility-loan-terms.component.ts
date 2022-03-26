import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-eligibility-loan-terms',
  templateUrl: './eligibility-loan-terms.component.html',
  styleUrls: ['./eligibility-loan-terms.component.scss'],
})
export class EligibilityLoanTermsComponent implements OnInit {
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
  displayedColumnsTab2: string[] = ['message'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.dataToLoad.push(
      {
        fico_range: '740-850',
        purchase: '80%',
        rate_term: '80%',
        cashout: '75%',
        highlight: true,
      },
      {
        fico_range: '720-739',
        purchase: '80%',
        rate_term: '80%',
        cashout: '75%',
      },
      {
        fico_range: '700-750',
        purchase: '80%',
        rate_term: '80%',
        cashout: '75%',
      },
      {
        fico_range: '640-650',
        purchase: '70%',
        rate_term: '70%',
        cashout: '75%',
      },
      {
        fico_range: '540-650',
        purchase: '80%',
        rate_term: '80%',
        cashout: '75%',
      },
      {
        fico_range: '440-550',
        purchase: '70%',
        rate_term: '60%',
        cashout: '75%',
      },
      {
        fico_range: '440-450',
        purchase: '80%',
        rate_term: '80%',
        cashout: '75%',
      },
      {
        fico_range: 'Foriegn National',
        purchase: '60%',
        rate_term: '60%',
        cashout: '65%',
      }
    );
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
      .get(`http://pricingengineapi.azurewebsites.net/api/ConfigureEligibility`)
      .subscribe((response: any) => {
        if (response?.data?.length) this.dataToLoad = response.data || [];
        this.dataToLoad[0].highlight = true;
      });
  }

  onTabChange(tabValue: number) {
    this.selectedTabIndex = tabValue;
  }
}
