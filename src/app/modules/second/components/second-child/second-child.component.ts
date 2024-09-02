import { BehaviorSubject, finalize } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IUser, UserService } from '@services';

@Component({
  selector: 'app-second-child',
  templateUrl: './second-child.component.html',
  styleUrls: ['./second-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf],
  providers: [UserService]
})
export class SecondChildComponent implements OnInit {
  loading$ = new BehaviorSubject(false);
  user$ = new BehaviorSubject<null | IUser>(null);
  title$ = this.userService.userGreeting$;
  loadCount$ = this.userService.loadCounter$;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.loading$.next(true);
    this.userService.getUser().pipe(
      finalize(() => this.loading$.next(false))
    ).subscribe(data => this.user$.next(data));
  }
}
