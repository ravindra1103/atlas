import { Component, Input, OnInit } from '@angular/core';
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
  isToggled: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }
}
