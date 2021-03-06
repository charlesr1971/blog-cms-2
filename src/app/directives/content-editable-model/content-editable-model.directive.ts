
import { Directive, ElementRef, Input, Output, EventEmitter, SimpleChanges, OnChanges, HostListener, Sanitizer, SecurityContext } from '@angular/core';

@Directive({
  selector: '[contenteditableModel]'
})
export class ContentEditableModelDirective implements OnChanges {

  /** Model */
  @Input() contenteditableModel: string;
  @Output() contenteditableModelChange?= new EventEmitter();
  /** Allow (sanitized) html */
  @Input() contenteditableHtml?: boolean = false;

  debug: boolean = false;

  constructor(
    private elRef: ElementRef,
    private sanitizer: Sanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contenteditableModel']) {
      // On init: if contenteditableModel is empty, read from DOM in case the element has content
      if (changes['contenteditableModel'].isFirstChange() && !this.contenteditableModel) {
        this.onInput(true);
      }
      if(this.debug) {
        console.log('contentEditableModelDirective.directive: ngOnChanges: ',changes['contenteditableModel']);
      }
      this.refreshView();
    }
  }

  @HostListener('input') // input event would be sufficient, but isn't supported by IE
  @HostListener('blur')  // additional fallback
  @HostListener('keyup') onInput(trim = false) {
    let value = this.elRef.nativeElement[this.getProperty()];
    if (trim) {
      value = value.replace(/^[\n\s]+/, '');
      value = value.replace(/[\n\s]+$/, '');
    }
    this.contenteditableModelChange.emit(value);
  }

  @HostListener('paste') onPaste() {
    this.onInput();
    if (!this.contenteditableHtml) {
      // For text-only contenteditable, remove pasted HTML.
      // 1 tick wait is required for DOM update
      setTimeout(() => {
        if (this.elRef.nativeElement.innerHTML !== this.elRef.nativeElement.innerText) {
          this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerText;
        }
      });
    }
  }

  private refreshView() {
    const newContent = this.sanitize(this.contenteditableModel);
     if(this.debug) {
      console.log('contentEditableModelDirective.directive: refreshView 1: ',newContent);
    }
    // Only refresh if content changed to avoid cursor loss
    // (as ngOnChanges can be triggered an additional time by onInput())
    if (newContent !== this.elRef.nativeElement[this.getProperty()]) {
      this.elRef.nativeElement[this.getProperty()] = newContent;
      if(this.debug) {
        console.log('contentEditableModelDirective.directive: refreshView 2: ',newContent);
      }
    }
  }

  private getProperty(): string {
    return this.contenteditableHtml ? 'innerHTML' : 'innerText';
  }

  private sanitize(content: string): string {
    return this.contenteditableHtml ? this.sanitizer.sanitize(SecurityContext.HTML, content) : content;
  }

}
