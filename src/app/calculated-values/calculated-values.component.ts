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

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('data clicked available-', this.dataOfClickedRow);
  }

  ngOnInit(): void {
  }

  onTabChange(tabValue:any) {
    this.selectedTab = tabValue;
  }
}
