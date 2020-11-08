import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: 'input[mzCheckbox], input[mz-checkbox]',
})
export class MzCheckboxDirective extends HandlePropChanges implements OnInit {
  // native properties
  @HostBinding() @Input() id: string;

  // directive properties
  @Input() filledIn: boolean;
  @Input() label: string;

  checkboxElement: JQuery;
  checkboxContainerElement: JQuery;
  labelElement: JQuery;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.initHandlers();
    this.initElements();
    this.handleProperties();
  }

  initHandlers() {
    this.handlers = {
      filledIn: () => this.handleFilledIn(),
      label: () => this.handleLabel(),
    };
  }

  initElements() {
    this.checkboxElement = $(this.elementRef.nativeElement);
    this.checkboxContainerElement = $(this.elementRef.nativeElement).parent('.checkbox-field');
    this.labelElement = this.createLabelElement();
  }

  createLabelElement() {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', this.id);

    (this.checkboxElement as any).after.apply(this.checkboxElement, [labelElement]);
    //this.renderer.invokeElementMethod(this.checkboxElement, 'after', [labelElement]);

    return $(labelElement);
  }

  handleProperties() {
    if (this.checkboxContainerElement.length === 0) {
      console.error('Input with mz-checkbox directive must be placed inside a [mz-checkbox-container] tag', this.checkboxElement);
      return;
    }

    super.executePropHandlers();
  }

  handleLabel() {
    (this.labelElement as any).text.apply(this.labelElement, [this.label]);
    //this.renderer.invokeElementMethod(this.labelElement, 'text', [this.label]);
  }

  handleFilledIn() {
    this.filledIn ? this.renderer.addClass(this.checkboxElement[0], 'filled-in')
            : this.renderer.removeClass(this.checkboxElement[0], 'filled-in')
    //this.renderer.setElementClass(this.checkboxElement[0], 'filled-in', this.filledIn);
  }
}
