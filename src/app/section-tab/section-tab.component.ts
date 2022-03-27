import { Component, Input, OnInit, Output } from '@angular/core';
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
  
  constructor() { }

  ngOnInit(): void {
  }
}
