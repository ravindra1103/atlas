import { Component, Input, OnInit } from '@angular/core';
import { InputForm } from '../shared/interfaces';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
})
export class InputFormComponent implements OnInit {
  @Input()
  inputFormData: InputForm = {} as InputForm;

  @Input()
  isToggled: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getClassToApply() {
    if (this.inputFormData?.twoColumnLayout && this.isToggled)
      return 'width145Px';
    else if (this.inputFormData?.twoColumnLayout && !this.isToggled)
      return 'width160Px';
    else if (this.isToggled) return 'width93Px';
    return 'width105Px';
  }
}
