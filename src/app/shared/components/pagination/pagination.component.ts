import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() maxVisiblePages = 5;
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() pageChange = new EventEmitter<number>();

  totalPages = 1;
  pages: (number | string)[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePages();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];

    if (this.totalPages <= this.maxVisiblePages) {
      // If we have fewer pages than the max visible, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      // Complex pagination with ellipsis
      const halfVisible = Math.floor(this.maxVisiblePages / 2);

      // Always show first page
      this.pages.push(1);

      // Calculate start page
      let startPage = Math.max(2, this.currentPage - halfVisible);

      // Calculate end page
      let endPage = Math.min(this.totalPages - 1, this.currentPage + halfVisible);

      // Adjust if we're at the beginning or end
      if (startPage <= 3) {
        startPage = 2;
        endPage = Math.min(this.totalPages - 1, startPage + this.maxVisiblePages - 3);
      }

      if (endPage >= this.totalPages - 2) {
        endPage = this.totalPages - 1;
        startPage = Math.max(2, endPage - this.maxVisiblePages + 3);
      }

      // Add ellipsis at the beginning if needed
      if (startPage > 2) {
        this.pages.push('...');
      }

      // Add the middle pages
      for (let i = startPage; i <= endPage; i++) {
        this.pages.push(i);
      }

      // Add ellipsis at the end if needed
      if (endPage < this.totalPages - 1) {
        this.pages.push('...');
      }

      // Always show last page
      this.pages.push(this.totalPages);
    }
  }

  changePage(page: number | string): void {
    // Skip if it's not a number (like ellipsis)
    if (typeof page !== 'number') {
      return;
    }

    if (this.disabled || page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.pageChange.emit(page);
  }
}
