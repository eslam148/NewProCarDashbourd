import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { GetMobileRequestDto } from '../../Models/DTOs/GetMobileRequestDto';
import { RequestSearchDto } from '../../Models/DTOs/RequestSearchDto';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import * as L from 'leaflet';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RouterModule } from '@angular/router';
import { fixLeafletIcons } from '../../leaflet-fix';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe, ActionButtonComponent, PaginationComponent, RouterModule],
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
  map: L.Map | null = null;
  nurseMarker: L.Marker | null = null;
  userMarker: L.Marker | null = null;
  Math = Math;

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

        // Initialize map after modal is fully visible
        setTimeout(() => {
          this.initMap();
        }, 500);
      },
      error: () => {
        this.loadingDetails = false;
      }
    });
  }

  closeDetails() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.selectedRequest = null;
    this.showDetailsModal = false;
  }

  initMap() {
    try {
      // Cleanup any existing map
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      if (!this.selectedRequest) {
        return;
      }

      const mapElement = document.getElementById('location-map');
      if (!mapElement) {
        console.error('Map container not found');
        return;
      }

      // Extract and validate coordinates
      const userLat = this.selectedRequest.latitude ? parseFloat(this.selectedRequest.latitude) : null;
      const userLng = this.selectedRequest.longitude ? parseFloat(this.selectedRequest.longitude) : null;

      if (!userLat || !userLng || isNaN(userLat) || isNaN(userLng)) {
        console.warn('Invalid user coordinates');
        return;
      }

      // Set explicit dimensions for map container to ensure proper rendering
      mapElement.style.width = '100%';
      mapElement.style.height = '250px';

      // Create map with simple configuration
      const userLatLng = L.latLng(userLat, userLng);
      this.map = L.map('location-map', {
        center: userLatLng,
        zoom: 14
      });

      // Add basic tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add user marker
      this.userMarker = L.marker(userLatLng).addTo(this.map);

      // Add nurse marker if valid coordinates exist
      const nurseLat = this.selectedRequest.nurseLatitude ? parseFloat(this.selectedRequest.nurseLatitude) : null;
      const nurseLng = this.selectedRequest.nurseLongitude ? parseFloat(this.selectedRequest.nurseLongitude) : null;

      if (nurseLat && nurseLng && !isNaN(nurseLat) && !isNaN(nurseLng)) {
        const nurseLatLng = L.latLng(nurseLat, nurseLng);

        // Add nurse marker
        this.nurseMarker = L.marker(nurseLatLng).addTo(this.map);

        // Add line between points
        L.polyline([userLatLng, nurseLatLng], {
          color: '#0ea5e9',
          weight: 3
        }).addTo(this.map);

        // Calculate distance
        const distance = userLatLng.distanceTo(nurseLatLng);
        const distanceKm = (distance / 1000).toFixed(2);

        // Add distance label
        const midpoint = L.latLng(
          (userLatLng.lat + nurseLatLng.lat) / 2,
          (userLatLng.lng + nurseLatLng.lng) / 2
        );

        L.marker(midpoint, {
          icon: L.divIcon({
            className: 'distance-tooltip',
            html: `${distanceKm} km`,
            iconSize: [80, 20]
          })
        }).addTo(this.map);

        // Fit map to show both markers
        this.map.fitBounds(L.latLngBounds([userLatLng, nurseLatLng]), {
          padding: [30, 30]
        });
      }

      // Force map to refresh its container size multiple times
      // to handle the side-by-side layout rendering properly
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize(true);
        }
      }, 100);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize(true);
        }
      }, 400);

      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize(true);
        }
      }, 800);

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
}
