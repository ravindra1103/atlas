import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-calculated-values',
  templateUrl: './calculated-values.component.html',
  styleUrls: ['./calculated-values.component.scss']
})
export class CalculatedValuesComponent implements OnInit, OnChanges {
  tabsToShow: string[] = ["Calc’d Value", "Loan Terms"];
  selectedTab: number = 0;

  @Input() dataToFillInForms: any;

  @Input() rateStackResponseReceived: any;

  @Input() formDataEnteredByUser: any;

  @Input() calculatedValues: any;

  @Output() onLockRate = new EventEmitter();

  @Input() lockRateDisabled = false;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // TODO: Calculate the value here
    // console.log('data clicked available-', this.dataOfClickedRow);
    // console.log("this.rateStackResponseReceived", this.rateStackResponseReceived);
    // console.log("this.formDataEnteredByUser", this.formDataEnteredByUser);
  }

  ngOnInit(): void {
  }

  onTabChange(tabValue: any) {
    this.selectedTab = tabValue;
  }
}
