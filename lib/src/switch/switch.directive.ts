import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mzSwitch], [mz-switch]',
})
export class MzSwitchDirective implements OnInit {
  @Input() off: string;
  @Input() on: string;

  switchContainerElement: JQuery;
  switchElement: JQuery;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.initElements();
    this.handleInputType();
  }

  initElements() {
    this.switchElement = $(this.elementRef.nativeElement);
    this.switchContainerElement = $(this.elementRef.nativeElement).parent('label').parent('.switch');

    if (this.switchContainerElement.length === 0) {
      console.error('Input with mz-switch directive must be placed inside an [mz-switch-container] tag', this.switchElement);
      return;
    }
  }

  handleInputType() {
    const type = this.switchElement.attr('type');
    if (type !== 'checkbox') {
      this.renderer.setAttribute(this.switchElement[0], 'type', 'checkbox');
      // this.renderer.setElementAttribute(this.switchElement[0], 'type', 'checkbox');
    }
  }
}
