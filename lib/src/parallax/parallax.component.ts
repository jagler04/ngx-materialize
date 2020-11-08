import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild } from '@angular/core';

@Component({
  selector: 'mz-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.scss'],
})
export class MzParallaxComponent implements AfterViewInit {
  @Input() height: number;

  @ViewChild('parallax') parallax: ElementRef;
  @ViewChild('parallaxContainer') parallaxContainer: ElementRef;

  constructor(public renderer: Renderer2) { }

  ngAfterViewInit(): void {
    isNaN(this.height) ? this.renderer.removeStyle(this.parallaxContainer.nativeElement, '500px')
              : this.renderer.setStyle(this.parallaxContainer.nativeElement, 'height', this.height + 'px');
    //this.renderer.setElementStyle(this.parallaxContainer.nativeElement, 'height', isNaN(this.height) ? '500px' : this.height + 'px');
    ($(this.parallax.nativeElement) as any).parallax.apply($(this.parallax.nativeElement));
    //this.renderer.invokeElementMethod($(this.parallax.nativeElement), 'parallax');
  }
}
