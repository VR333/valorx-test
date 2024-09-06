import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, fromEvent, interval, map, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IUser, MockUser, UserService } from '@services';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})
export class ChildComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title = '';
  @Input() user: IUser | null = null;
  count = 0;
  displayedColumns: string[] = ['id', 'contact_name', 'email', 'phone_number'];
  tableData$ = new BehaviorSubject<MockUser[]>([]);
  control = new FormControl();

  filteredData$ = new BehaviorSubject<MockUser[]>([]);

  @ViewChild('tableWrapper') private tableWrapper!: ElementRef<HTMLElement>;

  private isAllLoaded = false;
  private pageCount = 1;
  private perPage = 100;
  private total = 0;
  private destroy$ = new ReplaySubject(1);

  constructor(
    private changeDetector: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    // mark component for check manually
    // as an alternative to async pipe usage
    // use takeUntil to prevent memory leak
    interval(1000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.count++;
      this.changeDetector.markForCheck();
    });

    this.getTableUsers();

    this.control.valueChanges.pipe(
      map(value => value.trim()),
      filter(value => !!value),
      distinctUntilChanged(),
      switchMap(value => this.userService.searchContact(value)),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.filteredData$.next(value);
    });
  }

  ngAfterViewInit() {
    this.listenScroll();
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  changeByClickEvent() {
    this.count++;
  }

  private listenScroll() {
    const element = this.tableWrapper.nativeElement;
    fromEvent(element, 'scroll').pipe(
      debounceTime(50),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const scrollLimit = 200;
      const scrolledValue = element.scrollHeight - element.offsetHeight - element.scrollTop;
      const isEnoughScrolled = scrolledValue <= scrollLimit;

      if (isEnoughScrolled) {
        this.getTableUsers();
      }
    });
  }

  private getTableUsers() {
    if (this.isAllLoaded) {
      return;
    }

    const start = (this.pageCount - 1) * 100;
    const end = this.pageCount * this.perPage;
    const params = { start, end };
    this.userService.getUsers(params).subscribe(responce => {
      this.pageCount++;
      const records = [...this.tableData$.value, ...responce.data];
      this.tableData$.next(records);
      this.total = responce.total;
      this.isAllLoaded = this.total === this.tableData$.value.length;
    });
  }
}
