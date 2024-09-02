import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';

export interface IUser {
  name: string;
  age: number;
}

@Injectable({
  providedIn: 'any'
})
export class UserService {
  loadCounter$ = new BehaviorSubject(0);
  userGreeting$ = new BehaviorSubject('Welcome to Varlox!');

  getUser(): Observable<IUser> {
    const count = this.loadCounter$.value;
    const name = !count ? 'Rostyslav Vakh': 'Varlox employee: Rostyslav Vakh';

    return of({ name, age: 28 }).pipe(
      delay(2000),
      tap(() => {
        const newCount = count + 1;
        this.loadCounter$.next(newCount);

        if (newCount === 2) {
          this.userGreeting$.next('I am already here');
        }
      })
    );
  }
}
