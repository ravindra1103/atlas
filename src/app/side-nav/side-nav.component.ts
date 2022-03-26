import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @Input() isToggled: boolean = false;

  products: any;

  constructor() {}

  ngOnInit(): void {
    this.products = [
      {
        name: 'Olympus Homes',
        imageName: 'olympus-homes.png',
        isSelected: false,
      },
      {
        name: 'Hermes CRM',
        imageName: 'hermes-crm.png',
        isSelected: false,
      },
      {
        name: 'New Atlas Pricing Engine',
        imageName: 'olympus.png',
        isSelected: true,
      },
      {
        name: 'Zeus LOS',
        imageName: 'zeus-los.png',
        isSelected: false,
      },
    ];
  }
}
