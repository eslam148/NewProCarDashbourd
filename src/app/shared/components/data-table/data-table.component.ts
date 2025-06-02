import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActionButtonComponent } from '../action-button/action-button.component';
import { ButtonModule, CardModule, ModalModule, TooltipModule } from '@coreui/angular';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconModule,
    TranslatePipe,
    PaginationComponent,
    ActionButtonComponent,
    ButtonModule,
    CardModule,
    ModalModule,
    TooltipModule
  ]
})
export class DataTableComponent<T> {
  @Input() title: string = '';
  @Input() items: T[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() columns: { key: string, label: string, sortable?: boolean }[] = [];
  @Input() searchForm?: FormGroup;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItems: number = 0;
  @Input() createButtonText: string = 'common.create';
  @Input() showSearch: boolean = true;
  @Input() showCreateButton: boolean = true;
  @Input() searchPlaceholder: string = 'common.search';

  @Output() search = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() dismissErrorEvent = new EventEmitter<void>();
  @Output() pageSizeChange = new EventEmitter<number>();

  // Template references for custom column rendering
  @ContentChild('itemTemplate') itemTemplate?: TemplateRef<any>;
  @ContentChild('actionsTemplate') actionsTemplate?: TemplateRef<any>;
  @ContentChild('searchTemplate') searchTemplate?: TemplateRef<any>;
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<any>;

  // Default values
  defaultAvatarPath = 'assets/images/avatars/8.jpg';

  onSearch(): void {
    this.search.emit();
  }

  onCreateClick(): void {
    this.create.emit();
  }

  onEditClick(item: T): void {
    this.edit.emit(item);
  }

  onDeleteClick(item: T): void {
    this.delete.emit(item);
  }

  onPageChangeEvent(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChangeEvent(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (select) {
      const size = parseInt(select.value, 10);
      if (!isNaN(size)) {
        this.pageSizeChange.emit(size);
      }
    }
  }

  dismissError(): void {
    this.dismissErrorEvent.emit();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = this.defaultAvatarPath;
    }
  }

  getValue(item: any, key: string): any {
    return key.split('.').reduce((o, i) => o ? o[i] : null, item);
  }
}
