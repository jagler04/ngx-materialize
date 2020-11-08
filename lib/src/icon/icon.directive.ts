import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: 'i[mz-icon], i[mzIcon]',
})
export class MzIconDirective extends HandlePropChanges implements AfterViewInit {
  @Input() align: string;
  @Input() icon: string;
  @Input() size: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    this.initHandlers();
    this.initMaterialize();
    super.executePropHandlers();
  }

  initHandlers() {
    this.handlers = {
      align: (previousValue) => this.handleAlign(previousValue),
      icon: () => this.handleIcon(),
      size: (previousValue) => this.handleSize(previousValue),
    };
  }

  initMaterialize() {
    this.renderer.addClass(this.elementRef.nativeElement, 'material-icons');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'material-icons', true);
  }

  handleAlign(previousValue?: string) {
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, previousValue, false);
    }
    if (this.align) {
      this.renderer.addClass(this.elementRef.nativeElement, this.align);
      //this.renderer.setElementClass(this.elementRef.nativeElement, this.align, true);
    }
  }

  handleIcon() {
    this.icon ? this.renderer.addClass(this.elementRef.nativeElement, 'innerHTML')
            : this.renderer.removeClass(this.elementRef.nativeElement, 'innerHTML');
    //this.renderer.setElementProperty(this.elementRef.nativeElement, 'innerHTML', this.icon);
  }

  handleSize(previousValue?: string) {
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, previousValue, false);
    }
    if (this.size) {
      this.renderer.addClass(this.elementRef.nativeElement, this.size);
      //this.renderer.setElementClass(this.elementRef.nativeElement, this.size, true);
    }
  }
}
