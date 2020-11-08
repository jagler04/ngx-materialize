import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: 'a[mz-icon-mdi], a[mzIconMdi], i[mz-icon-mdi], i[mzIconMdi]',
})
export class MzIconMdiDirective extends HandlePropChanges implements AfterViewInit {
  @Input() align: string;
  @Input() flip: string;
  @Input() icon: string;
  @Input() rotate: string;
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
      flip: (previousValue) => this.handleFlip(previousValue),
      icon: (previousValue) => this.handleIcon(previousValue),
      rotate: (previousValue) => this.handleRotate(previousValue),
      size: (previousValue) => this.handleSize(previousValue),
    };
  }

  initMaterialize() {
    this.renderer.addClass(this.elementRef.nativeElement, 'mdi');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi', true);
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

  handleFlip(previousValue?: string) {
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-flip-' + previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-flip-' + previousValue, false);
    }
    !!this.flip ? this.renderer.addClass(this.elementRef.nativeElement, 'mdi-flip-' + this.flip)
              : this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-flip-' + this.flip);

    //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-flip-' + this.flip, !!this.flip);
  }

  handleIcon(previousValue?: string) {
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-' + previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-' + previousValue, false);
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'mdi-' + this.icon);
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-' + this.icon, true);
  }

  handleRotate(previousValue?: string) {
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-rotate-' + previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-rotate-' + previousValue, false);
    }
    !!this.rotate ? this.renderer.addClass(this.elementRef.nativeElement, 'mdi-rotate-' + this.rotate)
              : this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-rotate-' + this.rotate);
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-rotate-' + this.rotate, !!this.rotate);
  }

  handleSize(previousValue?: string) {
    if (!this.size) {
      this.size = '24px';
    }
    if (previousValue) {
      this.renderer.removeClass(this.elementRef.nativeElement, 'mdi-' + previousValue);
      //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-' + previousValue, false);
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'mdi-' + this.size);
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'mdi-' + this.size, true);
  }
}
