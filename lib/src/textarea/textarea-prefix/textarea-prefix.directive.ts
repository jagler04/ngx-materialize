import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: 'i[mzTextareaPrefix], i[mz-textarea-prefix]',
})
export class MzTextareaPrefixDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, 'prefix');
    //this.renderer.setElementClass(this.elementRef.nativeElement, 'prefix', true);
  }
}
