import { Component, EventEmitter, HostBinding, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output()
  toggleEmitter = new EventEmitter();

  @Output()
  themeToggleEmitter = new EventEmitter();

  @HostBinding('class') className = '';
  toggleControl = new FormControl(true);

  showArrow: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    // this.renderer.setAttribute(this.document.body, 'class', 'darkMode my-dark-style');

    this.toggleControl.valueChanges.subscribe((lightMode) => {
      const darkClassName = 'darkMode';
      this.className = lightMode ? darkClassName : '';
      if (!lightMode) {
        this.renderer.setAttribute(this.document.body, 'class', 'darkMode my-dark-style');
        this.themeToggleEmitter.emit("");
      } else {
        this.renderer.removeAttribute(this.document.body, 'class');
        this.renderer.setAttribute(this.document.body, 'class', 'my-light-style');
        this.themeToggleEmitter.emit("");
      }
    });
  }

  toggleSideNav() {
    this.toggleEmitter.emit("");
    this.showArrow = !this.showArrow;
  }

}
