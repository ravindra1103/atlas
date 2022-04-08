import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SingleSectionTab } from '../shared/interfaces';

@Component({
  selector: 'app-section-tab',
  templateUrl: './section-tab.component.html',
  styleUrls: ['./section-tab.component.scss']
})
export class SectionTabComponent implements OnInit {

  @Input()
  singleSectionTab: SingleSectionTab = {} as SingleSectionTab;

  @Input()
  dataToFillInForms: any;

  @Input()
  isToggled: boolean = false;

  @Input()
  tabNameSelected: string = '';

  @Input()
  rateStackResponseReceived: any;

  @Input() formDataEnteredByUser: any;

  @Input() calculatedValues: any;

  @Output() onRowSelection = new EventEmitter();

  @Input() messages: any;

  @Output() formUpdated = new EventEmitter();

  @Input() isEdit = false;

  constructor() { }

  ngOnInit(): void {
  }

  getKeyByName(name: string) {
    switch (name) {
      case 'LTR': return 'ltr';
      case 'Bridge Loan': return 'bridge';
      case 'Rehab': return 'rehab';
      default: return 'ltr';
    }
  }

  onRateStackSelectedRow(eventData: any) {
    this.onRowSelection.emit(eventData);
  }
}
