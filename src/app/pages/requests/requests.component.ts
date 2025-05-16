import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { GetMobileRequestDto } from '../../Models/DTOs/GetMobileRequestDto';
import { RequestSearchDto } from '../../Models/DTOs/RequestSearchDto';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requests: GetMobileRequestDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  filterForm: FormGroup;
  loading = false;
  showPrevious = false;
  selectedRequest: GetMobileRequestDto | null = null;
  loadingDetails = false;
  showDetailsModal = false;

  constructor(private requestService: RequestService, private fb: FormBuilder) {
    const today = new Date().toISOString().substring(0, 10);
    this.filterForm = this.fb.group({
      fromDate: [today],
      toDate: [today],
      status: ['']
    });
  }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    const filter = this.filterForm.value;
    const searchDto: RequestSearchDto = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      fromDate: filter.fromDate,
      toDate: filter.toDate
    };
    const serviceCall = this.showPrevious
      ? this.requestService.getAllPreviousRequests(searchDto)
      : this.requestService.getAllCurrentRequests(searchDto);
    serviceCall.subscribe({
      next: (res) => {
        this.requests = res.data.items;
        this.totalCount = res.data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilter() {
    this.pageNumber = 1;
    this.loadRequests();
  }

  onPageChange(page: number) {
    if (page < 1 || (page - 1) * this.pageSize >= this.totalCount) return;
    this.pageNumber = page;
    this.loadRequests();
  }

  toggleRequestType(showPrevious: boolean) {
    this.showPrevious = showPrevious;
    this.pageNumber = 1;
    this.loadRequests();
  }

  showDetails(id: string) {
    this.loadingDetails = true;
    this.requestService.getRequestById(id).subscribe({
      next: (res) => {
        this.selectedRequest = res.data;
        this.loadingDetails = false;
        this.showDetailsModal = true;
      },
      error: () => {
        this.loadingDetails = false;
      }
    });
  }

  closeDetails() {
    this.selectedRequest = null;
    this.showDetailsModal = false;
  }
}
