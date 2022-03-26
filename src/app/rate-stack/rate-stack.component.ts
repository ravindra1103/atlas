import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rate-stack',
  templateUrl: './rate-stack.component.html',
  styleUrls: ['./rate-stack.component.scss'],
})
export class RateStackComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = [];

  toggleControl = new FormControl(false);
  switchClicked = false;

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = ['rate', 'dscr', 'piti', 'price', 'disc_prem'];

    this.dataSource = [
      {
        rate: '4.5%',
        dscr: '0.14',
        piti: '$3,546.8',
        price: '-3',
        disc_prem: '$721,000',
      },
    ];
  }

  switchState() {
    this.switchClicked = !this.switchClicked;
  }
}
