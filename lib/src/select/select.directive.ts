import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

import { HandlePropChanges } from '../shared';

@Directive({
  selector: 'select[mzSelect], select[mz-select]',
})
export class MzSelectDirective extends HandlePropChanges implements OnInit, OnDestroy {
  // native properties
  @Input() id: string;
  @Input() disabled: boolean;
  @Input() placeholder: string;

  // directive properties
  @Input() label: string;
  @Input() filledIn: boolean;
  @Output() update = new EventEmitter();

  checkboxElements: JQuery;
  labelElement: JQuery;
  selectElement: JQuery;
  selectContainerElement: JQuery;

  get inputElement(): JQuery {
    return this.selectElement.siblings('input.select-dropdown');
  }

  mutationObserver: MutationObserver;
  suspend = false;

  constructor(
    private elementRef: ElementRef,
    public changeDetectorRef: ChangeDetectorRef,
    public renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit() {
    this.initHandlers();
    this.initElements();
    this.initOnChange();
    this.handleProperties();

    // must be done after handlePlaceholder
    this.initSelectedOption();

    // must be done after handleProperties
    this.initMaterialSelect();

    // must be done after initMaterialSelect
    this.listenOptionChanges();
    this.initFilledIn();
    this.handleDOMEvents();
  }

  ngOnDestroy() {
    (this.selectElement as any).material_select.apply(this.selectElement, ['destroy']);
    //this.renderer.invokeElementMethod(this.selectElement, 'material_select', ['destroy']);
    this.selectElement.off();
    this.mutationObserver.disconnect();
  }

  initHandlers() {
    this.handlers = {
      disabled: () => this.handleDisabled(),
      label: () => this.handleLabel(),
      placeholder: () => this.handlePlaceholder(),
    };
  }

  initElements() {
    this.selectElement = $(this.elementRef.nativeElement);
    this.selectContainerElement = $(this.elementRef.nativeElement).parents('.input-field');
    this.labelElement = this.createLabelElement();
  }

  /**
   * Need to be done after material_select has been invoked or else the multi-select
   * options are not yet in the DOM as it loops on rendered options
   */
  initFilledIn() {
    this.checkboxElements = this.selectContainerElement.find(':checkbox');
    this.handlers['filledIn'] = () => this.handleFilledIn();
    this.handleFilledIn();
  }

  initMaterialSelect() {
    (this.selectElement as any).material_select.apply(this.selectElement);
    //this.renderer.invokeElementMethod(this.selectElement, 'material_select');
  }

  /**
   * Trigger the native change event from select element instead of the JQuery.
   * An issue on Github is open about this problem : https://github.com/Dogfalo/materialize/issues/2843
   * This method should be removed when this issue is revolved.
   */
  initOnChange() {
    this.selectElement.on('change', (event: any) => {
      if (!this.suspend) {
        this.suspend = true;

        const customEvent = document.createEvent('CustomEvent');
        customEvent.initCustomEvent('change', true, false, event.target.value);

        (this.selectElement[0] as any).dispatchEvent.apply(this.selectElement[0], [customEvent]);
        //this.renderer.invokeElementMethod(this.selectElement[0], 'dispatchEvent', [customEvent]);
      }
    });

    // Stop the propagation of change event
    this.selectElement[0].addEventListener('change', () => {
      this.suspend = false;
    });
  }

  handleDOMEvents() {
    //this.inputElement.on('blur focus', (event: JQuery.Event) => {
    this.inputElement.on('blur focus', (event: JQuery.TriggeredEvent) => {
      const customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(event.type, true, false, event.target);
      this.selectElement[0].dispatchEvent(customEvent);
    });
  }

  createLabelElement() {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', this.id);

    (this.selectElement as any).after.apply(this.selectElement, [labelElement]);
    //this.renderer.invokeElementMethod(this.selectElement, 'after', [labelElement]);

    return $(labelElement);
  }

  handleProperties() {
    if (this.selectContainerElement.length === 0) {
      console.error('Select with mz-select directive must be place inside a [mz-select-container] tag', this.selectElement);
      return;
    }
    super.executePropHandlers();
  }

  initSelectedOption() {
    const firstOptionElement = this.selectElement.children().first();
    if (firstOptionElement.length > 0
      && this.selectElement.children('option[selected]').length === 0
      && !this.selectElement[0].hasAttribute('multiple')
    ) {
      this.renderer.setAttribute(firstOptionElement[0], 'selected', '');
      //this.renderer.setElementAttribute(firstOptionElement[0], 'selected', '');
    }
  }

  handleDisabled() {
    // when disabled is null/undefined that means the property has not been used on the element
    // but it might be set by another process (for example reactive form applies disabled attribute itself)
    // therefore we don't want to remove or add it here
    if (this.disabled != null) {
      this.renderer.setProperty(this.selectElement[0], 'disabled', !!this.disabled);
      //this.renderer.setElementProperty(this.selectElement[0], 'disabled', !!this.disabled);
      this.updateMaterialSelect();
    }
  }

  handleLabel() {
    if (this.label != null) {
      (this.labelElement as any).text.apply(this.labelElement, [this.label]);
      //this.renderer.invokeElementMethod(this.labelElement, 'text', [this.label]);
    }
  }

  handleFilledIn() {
    if (this.checkboxElements.length > 0) {
      this.checkboxElements.toArray().forEach(checkboxElement => {
        !!this.filledIn ? this.renderer.addClass(checkboxElement, 'filled-in')
                : this.renderer.removeClass(checkboxElement, 'filled-in');
        //this.renderer.setElementClass(checkboxElement, 'filled-in', !!this.filledIn);
      });
    }
  }

  handlePlaceholder() {
    const placeholderElement = this.selectElement.children(':disabled').first();

    // if placeholder element exists
    if (placeholderElement.length > 0) {

      if (this.placeholder) {
        // update existing placeholder element
        (placeholderElement as any).text.apply(placeholderElement, [this.placeholder]);
        //this.renderer.invokeElementMethod(placeholderElement, 'text', [this.placeholder]);
      } else {
        // remove existing placeholder element
        (placeholderElement as any).remove.apply(placeholderElement);
        //this.renderer.invokeElementMethod(placeholderElement, 'remove');
        // Force trigger change event since it's not triggered when value change programmatically
        (this.selectElement as any).change.apply(this.selectElement);
        //this.renderer.invokeElementMethod(this.selectElement, 'change');
        // Required if we don't want exception "Expression has changed after it was checked." https://github.com/angular/angular/issues/6005
        this.changeDetectorRef.detectChanges();
      }
    } else {
      if (this.placeholder) {
        // add placeholder element
        const placeholderText = document.createTextNode(this.placeholder);
        const placeholderOption = document.createElement('option');
        placeholderOption.disabled = true;
        placeholderOption.value = null;
        placeholderOption.appendChild(placeholderText);

        (this.selectElement as any).prepend.apply(this.selectElement, [placeholderOption]);
        //this.renderer.invokeElementMethod(this.selectElement, 'prepend', [placeholderOption]);
      }
    }

    this.initMaterialSelect();
  }

  listenOptionChanges() {
    const mutationObserverConfiguration: MutationObserverInit = {
      childList: true,
      subtree: true,
    };

    this.mutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      this.updateMaterialSelect();
    });

    this.mutationObserver.observe(this.selectElement[0], mutationObserverConfiguration);
  }

  updateMaterialSelect() {
    this.initMaterialSelect();

    if (this.filledIn) {
      this.initFilledIn();
    }

    this.handleDOMEvents();

    // wait for materialize select to be initialized
    // /!\ race condition warning /!\
    setTimeout(() => this.update.emit());
  }
}