import { DOCUMENT } from '@angular/common';
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isToggled: boolean = false;
  isDarkThemeChosen: boolean = false;

  toggleControl = new FormControl(false);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.removeAttribute(this.document.body, 'class');
    this.renderer.setAttribute(this.document.body, 'class', 'my-light-style');
  }

  onToggle() {
    this.isToggled = !this.isToggled;
  }

  onThemeToggle() {
    this.isDarkThemeChosen = !this.isDarkThemeChosen;
  }
}
