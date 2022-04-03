import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlynumber]'
})
export class OnlynumberDirective {

  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || 
      (e.key === 'a' && e.ctrlKey === true) || 
      (e.key === 'c' && e.ctrlKey === true) || 
      (e.key === 'v' && e.ctrlKey === true) || 
      (e.key === 'x' && e.ctrlKey === true) || 
      (e.key === 'a' && e.metaKey === true) || 
      (e.key === 'c' && e.metaKey === true) || 
      (e.key === 'v' && e.metaKey === true) || 
      (e.key === 'x' && e.metaKey === true) 
    ) {
      return;
    }
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData?.getData('text/plain').replace(/\D/g, '') || '';
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event?.dataTransfer?.getData('text').replace(/\D/g, '') || '';
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }
}