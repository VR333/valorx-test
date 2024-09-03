import { BehaviorSubject, finalize, interval, ReplaySubject, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IUser, UserService } from '@services';
import { SecondChildComponent } from './components';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, SecondChildComponent, MatButtonModule, MatDividerModule, MatProgressSpinnerModule]
})
export class SecondComponent implements OnInit, OnDestroy {
  count = 0;
  oopsIamNotUpdatedAnymore = Math.random();
  loading$ = new BehaviorSubject(false);
  user$ = new BehaviorSubject<null | IUser>(null);
  title$ = this.userService.userGreeting$;
  loadCount$ = this.userService.loadCounter$;

  private destroy$ = new ReplaySubject(1);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();

    // since no markForCheck usage or async pipe
    // this property won't be updated in the view
    // use takeUntil to prevent memory leak
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.oopsIamNotUpdatedAnymore = Math.random();
    })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  loadUser() {
    // changes will be displayed as values are consumed with async pipe
    // that will mark component for check
    this.loading$.next(true);
    this.userService.getUser().pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe(data => this.user$.next(data));
  }

  changeByClickEvent() {
    this.count++;
  }
}
