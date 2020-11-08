import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: 'input[mzRadioButton], input[mz-radio-button]',
})
export class MzRadioButtonDirective extends HandlePropChanges implements OnInit {
  // native properties
  @HostBinding() @Input() id: string;

  // directive properties
  @Input() label: string;
  @Input() withGap: boolean;

  inputElement: JQuery;
  inputContainerElement: JQuery;
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
      label: () => this.handleLabel(),
      withGap: () => this.handleWithGap(),
    };
  }

  initElements() {
    this.inputElement = $(this.elementRef.nativeElement);
    this.inputContainerElement = $(this.elementRef.nativeElement).parent('.radio-button-field');
    this.labelElement = this.createLabelElement();
  }

  createLabelElement() {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', this.id);

    (this.inputElement as any).after.apply(this.inputElement, [labelElement]);
    //this.renderer.invokeElementMethod(this.inputElement, 'after', [labelElement]);

    return $(labelElement);
  }

  handleProperties() {
    if (this.inputContainerElement.length === 0) {
      console.error('Radio Button must be placed inside a [mz-radio-button-container] tag', this.inputElement);
      return;
    }

    super.executePropHandlers();
  }

  handleLabel() {
    (this.labelElement as any).text.apply(this.labelElement, [this.label]);
    //this.renderer.invokeElementMethod(this.labelElement, 'text', [this.label]);
  }

  handleWithGap() {
    this.withGap ? this.renderer.addClass(this.inputElement[0], 'with-gap')
            : this.renderer.removeClass(this.inputElement[0], 'with-gap');
    //this.renderer.setElementClass(this.inputElement[0], 'with-gap', this.withGap);
  }
}
