import { interval, ReplaySubject, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IUser } from '@services';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule]
})
export class ChildComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() user: IUser | null = null;
  count = 0;

  private destroy$ = new ReplaySubject(1);

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // mark component for check manually
    // as an alternative to async pipe usage
    // use takeUntil to prevent memory leak
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.count++;
      this.changeDetector.markForCheck();
    })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  changeByClickEvent() {
    this.count++;
  }
}
