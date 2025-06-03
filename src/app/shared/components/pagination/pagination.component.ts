import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() maxVisiblePages = 5;
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showInfo = true; // Show pagination info (e.g., "Showing 1 to 10 of 25 entries")
  @Input() layout: 'default' | 'simple' | 'info-only' = 'default'; // Layout options

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

  // Helper methods for pagination info
  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.changePage(this.currentPage + 1);
    }
  }

  // RTL Detection
  get isRTL(): boolean {
    return document.documentElement.dir === 'rtl' ||
           document.body.dir === 'rtl' ||
           getComputedStyle(document.documentElement).direction === 'rtl';
  }
}
