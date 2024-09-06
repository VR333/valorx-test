import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { MOCK_DATA } from './MOCK_DATA';
import { IUser, MockParams, MockResponce, MockUser } from './user.interface';

const SORTED_MOCK = [...MOCK_DATA].sort((a, b) => a.contact_name.localeCompare(b.contact_name));


@Injectable({
  providedIn: 'any'
})
export class UserService {
  loadCounter$ = new BehaviorSubject(0);
  userGreeting$ = new BehaviorSubject('Welcome to Valorx!');

  getUser(): Observable<IUser> {
    const count = this.loadCounter$.value;
    const name = !count ? 'Rostyslav Vakh': 'Valorx employee: Rostyslav Vakh';

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

  searchContact(value: string): Observable<MockUser[]> {
    const data = SORTED_MOCK.filter(user => {
      if (user.id === (+value)) {
        return true;
      }

      if (user.contact_name.includes(value)) {
        return true;
      }

      if (user.email.includes(value)) {
        return true;
      }

      return false;
    });

    return of(data);
  }

  getUsers(params: MockParams): Observable<MockResponce> {
    const total = SORTED_MOCK.length;
    const endIndex = params.end >= total ? total : params.end;
    const response: MockResponce = {
      total,
      data: SORTED_MOCK.slice(params.start, endIndex)
    };

    return of(response);
  }
}
