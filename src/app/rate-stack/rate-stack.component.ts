import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  selectedRowIndex: number = -1;

  @Output()
  onRateStackSelectedRow = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    let newDataToBind = [];
    let count = 0, indexOfPar;
    const goal = 1;
    let is_par = Infinity
    if (this.rateStackResponseReceived?.length) {
      for (let rateRow of this.rateStackResponseReceived) {
        newDataToBind.push({
          id: count++,
          rate: rateRow['rate'],
          dscr: rateRow['dscr'],
          piti: rateRow['piti'],
          price: rateRow['price'],
          disc_prem: rateRow['disc'],
          approval_code: rateRow['approval_code']
        });
        if (rateRow['is_par'] === goal) {
          is_par = rateRow['is_par'];
          indexOfPar = count - 1;
        } else if (Math.abs(rateRow['is_par'] - goal) < Math.abs(is_par - goal)) {
          indexOfPar = count - 1;
          is_par = rateRow['is_par'];
        }
      }
      this.dataSource = newDataToBind;
      this.selectedRowIndex = indexOfPar || 0;
      this.onRateStackSelectedRow.emit(this.dataSource[this.selectedRowIndex]);
    }
  }

  ngOnInit(): void {
    this.displayedColumns = ['rate', 'dscr', 'piti', 'price', 'disc_prem'];
    // this.dataSource=[{id: 0, rate: 1, dscr: 22, piti: 33, price: 333, disc_prem: 77}, {id: 1, rate: 1, dscr: 22, piti: 33, price: 333, disc_prem: 77}];
  }

  switchState() {
    this.switchClicked = !this.switchClicked;
    let count = 0;
    if (this.switchClicked) {
      let newDataToBind = [];
      if (this.rateStackResponseReceived?.length) {
        for (let rateRow of this.rateStackResponseReceived) {
          newDataToBind.push({
            id: count++,
            rate: rateRow['rate'],
            dscr: rateRow['io_dscr'],
            piti: rateRow['io_piti'],
            price: rateRow['io_price'],
            disc_prem: rateRow['io_disc'],
          });
        }
        this.dataSource = newDataToBind;
      }
    } else {
      let newDataToBind = [];
      if (this.rateStackResponseReceived?.length) {
        for (let rateRow of this.rateStackResponseReceived) {
          newDataToBind.push({
            id: count++,
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
  }

  rowClick(row: any) {
    this.selectedRowIndex = row.id;
    this.onRateStackSelectedRow.emit(row);
  }
}
