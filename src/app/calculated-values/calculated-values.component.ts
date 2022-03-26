import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculated-values',
  templateUrl: './calculated-values.component.html',
  styleUrls: ['./calculated-values.component.scss']
})
export class CalculatedValuesComponent implements OnInit {
  tabsToShow: string[] = ["Calc’d Value", "Loan Terms"];
  selectedTab: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  onTabChange(tabValue:any) {
    this.selectedTab = tabValue;
  }
}
