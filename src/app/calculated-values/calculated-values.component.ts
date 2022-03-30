import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-calculated-values',
  templateUrl: './calculated-values.component.html',
  styleUrls: ['./calculated-values.component.scss']
})
export class CalculatedValuesComponent implements OnInit, OnChanges {
  tabsToShow: string[] = ["Calc’d Value", "Loan Terms"];
  selectedTab: number = 0;

  @Input()
  dataOfClickedRow: any;

  @Input() dataToFillInForms: any;

  @Input() rateStackResponseReceived: any;

  @Input() formDataEnteredByUser: any;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO: Calculate the value here
    console.log('data clicked available-', this.dataOfClickedRow);
    console.log("this.rateStackResponseReceived", this.rateStackResponseReceived);
    console.log("this.formDataEnteredByUser", this.formDataEnteredByUser);
  }

  ngOnInit(): void {
  }

  onTabChange(tabValue:any) {
    this.selectedTab = tabValue;
  }
}
