import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAdmins, selectAdminLoading } from '../../../store/admin/admin.selectors';
import { loadAdmins } from '../../../store/admin/admin.actions';
import { AdminsDto } from '../../../Models/DTOs/AdminsDto';
import { PaginationModule } from '@coreui/angular';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, PaginationModule],
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

  onPageSizeChange(newSize: string) {
    this.pageSize = +newSize;
    this.currentPage = 1;
    this.loadAdmins();
  }

  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
  }
}
