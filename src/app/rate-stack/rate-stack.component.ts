import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rate-stack',
  templateUrl: './rate-stack.component.html',
  styleUrls: ['./rate-stack.component.scss'],
})
export class RateStackComponent implements OnInit, OnChanges {
  @Input()
  rateStackResponseReceived: any;

  dataSource: any;
  displayedColumns: string[] = [];

  toggleControl = new FormControl(false);
  switchClicked = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    let newDataToBind = [];
    if (this.rateStackResponseReceived?.length) {
      for (let rateRow of this.rateStackResponseReceived) {
        newDataToBind.push({
          rate: rateRow['rate'],
          dscr: rateRow['dscr'],
          piti: rateRow['piti'],
          price: rateRow['price'],
          disc_prem: rateRow['disc'],
        });
      }
      this.dataSource = newDataToBind;
    }
  }

  ngOnInit(): void {
    this.displayedColumns = ['rate', 'dscr', 'piti', 'price', 'disc_prem'];
  }

  switchState() {
    this.switchClicked = !this.switchClicked;
    if (this.switchClicked) {
      let newDataToBind = [];
      if (this.rateStackResponseReceived?.length) {
        for (let rateRow of this.rateStackResponseReceived) {
          newDataToBind.push({
            rate: rateRow['rate'],
            dscr: rateRow['io_dscr'],
            piti: rateRow['io_piti'],
            price: rateRow['io_price'],
            disc_prem: rateRow['io_disc'],
          });
        }
        this.dataSource = newDataToBind;
      }
    }
  }
}
