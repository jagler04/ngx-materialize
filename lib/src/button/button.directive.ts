import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
} from '@angular/core';

import { HandlePropChanges } from '../shared/index';

@Directive({
  selector: `
    a[mz-button],
    a[mzButton],
    button[mz-button],
    button[mzButton]`,
})
export class MzButtonDirective extends HandlePropChanges implements OnInit {
  @Input() disabled: boolean;
  @Input() flat: boolean;
  @Input() float: boolean;
  @Input() large: boolean;
  @Input() noWaves: boolean;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.initHandlers();
    this.initMaterialize();
    super.executePropHandlers();
  }

  initHandlers() {
    this.handlers = {
      disabled: () => this.handleDisabled(),
      flat: () => this.handleFlat(),
      float: () => this.handleFloat(),
      large: () => this.handleLarge(),
      noWaves: () => this.handleNoWaves(),
    };
  }

  initMaterialize() {
    this.renderer.addClass(this.elementRef.nativeElement, 'btn');
  }

  handleDisabled() {
    this.disabled ? this.renderer.addClass(this.elementRef.nativeElement, 'disabled') : this.renderer.removeClass(this.elementRef.nativeElement, 'disabled');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'disabled', this.disabled);
  }

  handleFlat() {
    !this.flat ? this.renderer.addClass(this.elementRef.nativeElement, 'btn')
    : this.renderer.removeClass(this.elementRef.nativeElement, 'btn');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'btn', !this.flat);
    this.flat ? this.renderer.addClass(this.elementRef.nativeElement, 'btn-flat')
    : this.renderer.removeClass(this.elementRef.nativeElement, 'btn-flat');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'btn-flat', this.flat);
  }

  handleFloat() {
    this.flat ? this.renderer.addClass(this.elementRef.nativeElement, 'btn-floating')
    : this.renderer.removeClass(this.elementRef.nativeElement, 'btn-floating');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'btn-floating', this.float);
  }

  handleLarge() {
    this.large ? this.renderer.addClass(this.elementRef.nativeElement, 'btn-large')
    : this.renderer.removeClass(this.elementRef.nativeElement, 'btn-large');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'btn-large', this.large);
  }

  handleNoWaves() {
    !this.noWaves ? this.renderer.addClass(this.elementRef.nativeElement, 'waves-effect')
      : this.renderer.removeClass(this.elementRef.nativeElement, 'waves-effect');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'waves-effect', !this.noWaves);

    if (!this.flat) {
      !this.noWaves ? this.renderer.addClass(this.elementRef.nativeElement, 'waves-light')
        : this.renderer.removeClass(this.elementRef.nativeElement, 'waves-light');
      //this.renderer.setElementClass(this.elementRef.nativeElement, 'waves-light', !this.noWaves);
    }
  }
}
