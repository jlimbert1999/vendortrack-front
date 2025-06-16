import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'infinite-scroll-wrapper',
  imports: [InfiniteScrollDirective],
  template: `
    <div
      infiniteScroll
      [infiniteScrollDistance]="2"
      [infiniteScrollThrottle]="500"
      [infiniteScrollContainer]="containerRef()"
      (scrolled)="load()"
    >
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollWrapperComponent {
  containerRef = input.required<HTMLDivElement>();
  onScroll = output<void>();

  load(): void {
    console.log('scrolled!!');
    this.onScroll.emit();
  }
}
