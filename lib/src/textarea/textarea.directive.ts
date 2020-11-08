import { Directive, ElementRef, Input, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: 'textarea[mzTextarea], textarea[mz-textarea]',
})
export class MzTextareaDirective extends HandlePropChanges implements OnInit, OnDestroy {
  // native properties
  @Input() id: string;
  @Input() placeholder: string;

  // directive properties
  @Input() label: string;
  @Input() length: number;

  textareaElement: JQuery;
  textareaContainerElement: JQuery;
  textareaValueSubscription: Subscription;
  labelElement: JQuery;

  constructor(
    @Optional() private ngControl: NgControl,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit() {
    this.initHandlers();
    this.initElements();
    this.initTextareaSubscription();
    this.handleProperties();
  }

  ngOnDestroy() {
    if (this.textareaValueSubscription) {
      this.textareaValueSubscription.unsubscribe();
    }
  }

  initHandlers() {
    this.handlers = {
      label: () => this.handleLabel(),
      length: () => this.handleLength(),
      placeholder: () => this.handlePlaceholder(),
    };
  }

  initElements() {
    this.textareaElement = $(this.elementRef.nativeElement);
    this.textareaContainerElement = $(this.elementRef.nativeElement).parent('.input-field');
    this.labelElement = this.createLabelElement();
    this.initTextarea();
  }

  initTextarea() {
    this.renderer.addClass(this.textareaElement[0], 'materialize-textarea');
    //this.renderer.setElementClass(this.textareaElement[0], 'materialize-textarea', true);
  }

  initTextareaSubscription() {
    if (this.ngControl) {
      this.textareaValueSubscription = this.ngControl.valueChanges.subscribe(() => this.setLabelActive());
    }
  }

  createLabelElement() {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', this.id);

    (this.textareaElement as any).after.apply(this.textareaElement, [labelElement]);
    //this.renderer.invokeElementMethod(this.textareaElement, 'after', [labelElement]);

    return $(labelElement);
  }

  handleProperties() {
    if (this.textareaContainerElement.length === 0) {
      console.error('Textarea must be placed inside a [mz-textarea-container] tag', this.textareaElement);
      return;
    }

    super.executePropHandlers();
  }

  handleLabel() {
    if (this.placeholder || this.textareaElement.val()) {
      this.renderer.addClass(this.labelElement[0], 'active');
      //this.renderer.setElementClass(this.labelElement[0], 'active', true);
    }

    (this.labelElement as any).text.apply(this.labelElement, [this.label]);
    //this.renderer.invokeElementMethod(this.labelElement, 'text', [this.label]);
  }

  handleLength() {
    const length = this.length ? this.length.toString() : null;

    length === null ? this.renderer.removeAttribute(this.textareaElement[0], 'data-length')
            : this.renderer.setAttribute(this.textareaElement[0], 'data-length', length);
    //this.renderer.setElementAttribute(this.textareaElement[0], 'data-length', length);

    if (length) {
      this.setCharacterCount();
    } else {
      this.removeCharacterCount();
    }
  }

  handlePlaceholder() {
    const placeholder = !!this.placeholder ? this.placeholder : null;
    placeholder === null ? this.renderer.removeAttribute(this.textareaElement[0], 'placeholder')
            : this.renderer.setAttribute(this.textareaElement[0], 'placeholder', placeholder);
    //this.renderer.setElementAttribute(this.textareaElement[0], 'placeholder', placeholder);

    this.setLabelActive();
  }

  setCharacterCount() {
    (this.textareaElement as any).characterCounter.apply(this.textareaElement);
    //this.renderer.invokeElementMethod(this.textareaElement, 'characterCounter');

    // force validation
    // need setTimeout otherwise it wont trigger validation right away
    setTimeout(() => {
      (this.textareaElement as any).trigger.apply(this.textareaElement, ['input']);
      (this.textareaElement as any).trigger.apply(this.textareaElement, ['blur']);
      //this.renderer.invokeElementMethod(this.textareaElement, 'trigger', ['input']);
      //this.renderer.invokeElementMethod(this.textareaElement, 'trigger', ['blur']);
    });
  }

  setLabelActive() {
    // need setTimeout otherwise it wont make label float in some circonstances
    // for example: forcing validation for example, reseting form programmaticaly, ...
    setTimeout(() => {
      const textareaValue = (<HTMLTextAreaElement>this.textareaElement[0]).value;
      const isActive = !!this.placeholder || !!textareaValue;
      isActive ? this.renderer.addClass(this.labelElement[0], 'active')
              : this.renderer.removeClass(this.labelElement[0], 'active');
      //this.renderer.setElementClass(this.labelElement[0], 'active', isActive);
    });
  }

  removeCharacterCount() {
    (this.textareaElement.siblings('.character-counter') as any).remove.apply(this.textareaElement.siblings('.character-counter'));
    //this.renderer.invokeElementMethod(this.textareaElement.siblings('.character-counter'), 'remove');

    this.removeValidationClasses();
  }

  removeValidationClasses() {
    // reset valid/invalid state
    this.renderer.removeClass(this.textareaElement[0], 'invalid');
    this.renderer.removeClass(this.textareaElement[0], 'valid');
    //this.renderer.setElementClass(this.textareaElement[0], 'invalid', false);
    //this.renderer.setElementClass(this.textareaElement[0], 'valid', false);
  }
}
