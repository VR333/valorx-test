import { finalize } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService, IUser } from '@services';
import { ChildComponent } from './components';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
  standalone: true,
  imports: [ChildComponent, NgIf, MatButtonModule, MatDividerModule, MatProgressSpinnerModule]
})
export class FirstComponent implements OnInit {
  loading = false;
  user: IUser | null = null;
  count = 0;

  constructor(private userService: UserService) {}

  get userGreetings() {
    return this.userService.userGreeting$.value;
  }

  get loadCount() {
    return this.userService.loadCounter$.value;
  }

  ngOnInit() {
    this.loadUser();
  }

  changeCount() {
    this.count++;
  }

  loadUser() {
    this.loading = true;
    this.userService.getUser().pipe(
      finalize(() => (this.loading = false))
    ).subscribe(data => (this.user = data));
  }
}
