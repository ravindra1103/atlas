import { Component, Input, OnInit } from '@angular/core';
import { InputForm } from '../shared/interfaces';

@Component({
  selector: 'app-property-economics-other',
  templateUrl: './property-economics-other.component.html',
  styleUrls: ['./property-economics-other.component.scss']
})
export class PropertyEconomicsOtherComponent implements OnInit {

  @Input()
  inputFormData: InputForm = {} as InputForm;

  @Input() 
  isToggled: boolean = false;
 
  strategies: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.strategies = ['Hold', 'Sell'];
    console.log('inputFormData:', this.inputFormData);
    console.log('isToggled:', this.isToggled);
  }

  getClassToApply() {
    if (this.inputFormData?.twoColumnLayout && this.isToggled)
      return 'width145Px';
    else if (this.inputFormData?.twoColumnLayout && !this.isToggled)
      return 'width160Px';
    else if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }
}
