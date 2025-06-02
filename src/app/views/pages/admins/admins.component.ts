import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAdmins, selectAdminLoading } from '../../../store/admin/admin.selectors';
import { loadAdmins } from '../../../store/admin/admin.actions';
import { AdminsDto } from '../../../Models/DTOs/AdminsDto';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';
import { PaginationModule } from '@coreui/angular';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, PaginationModule, PaginationComponent],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss'
})
export class AdminsComponent implements OnInit {
  admins$: Observable<any>;
  loading$: Observable<boolean>;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  direction: 'rtl' | 'ltr' = 'ltr';

  constructor(private store: Store) {
    this.admins$ = this.store.select(selectAdmins);
    this.loading$ = this.store.select(selectAdminLoading);
  }

  ngOnInit() {
    this.admins$.subscribe(admins => {
      if (admins) {
        this.totalItems = admins.totalCount || (admins.items?.length ?? 0);
      }
    });
    this.loadAdmins();
  }

  loadAdmins() {
    this.store.dispatch(loadAdmins({ page: this.currentPage, pageSize: this.pageSize }));
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadAdmins();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.pageSize = +target.value;
      this.currentPage = 1;
      this.loadAdmins();
    }
  }

  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
  }
}
