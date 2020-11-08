import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'i[mzInputPrefix], i[mz-input-prefix]',
})
export class MzInputPrefixDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, 'prefix');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'prefix', true);
  }
}
