import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class MapSelectorComponent implements AfterViewInit, OnChanges {
  @Input() initialLatitude: number = 30.0444;  // Default to Egypt's latitude
  @Input() initialLongitude: number = 31.2357; // Default to Egypt's longitude
  @Input() initialZoom: number = 13;
  @Input() visible: boolean = true;
  @Output() locationSelected = new EventEmitter<{lat: number, lng: number}>();
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private marker: L.Marker | null = null;
  private isMapInitialized = false;
  private initializationAttempts = 0; // Track initialization attempts

  constructor() {
    // Ensure Leaflet CSS is loaded immediately
    this.ensureLeafletCssLoaded();
  }

  ngAfterViewInit(): void {
    // Wait for the DOM to be ready before initializing
    setTimeout(() => {
      this.tryInitializeMap();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If visibility changed to true, refresh the map
    if (changes['visible'] && changes['visible'].currentValue === true) {
      setTimeout(() => {
        this.refreshMap();
      }, 300);
    }
  }

  // Ensure Leaflet CSS is loaded
  private ensureLeafletCssLoaded(): void {
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const leafletCssLink = document.createElement('link');
      leafletCssLink.id = linkId;
      leafletCssLink.rel = 'stylesheet';
      leafletCssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      leafletCssLink.crossOrigin = '';
      document.head.appendChild(leafletCssLink);
    }
  }

  private tryInitializeMap(): void {
    if (this.initializationAttempts >= 3) {
      console.warn('Max map initialization attempts reached');
      return;
    }

    this.initializationAttempts++;

    // Check if map container exists in DOM
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map container not found in DOM, retrying...');
      setTimeout(() => this.tryInitializeMap(), 300);
      return;
    }

    try {
      this.initMap();
    } catch (error) {
      console.error('Error initializing map, retrying...', error);
      setTimeout(() => this.tryInitializeMap(), 300);
    }
  }

  private initMap(): void {
    if (this.isMapInitialized && this.map) {
      // If already initialized, just resize and center
      this.map.invalidateSize(true);
      if (this.initialLatitude && this.initialLongitude) {
        this.map.setView([this.initialLatitude, this.initialLongitude], this.initialZoom);
      }
      return;
    }

    // Destroy existing map instance if it exists but isn't properly initialized
    if (this.map) {
      try {
        this.map.remove();
      } catch (error) {
        console.error('Error removing existing map:', error);
      }
    }

    // Create a new map instance
    this.map = L.map('map', {
      zoomControl: true,
      attributionControl: true
    }).setView(
      [this.initialLatitude || 30.0444, this.initialLongitude || 31.2357],
      this.initialZoom
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add initial marker if coordinates are provided
    if (this.initialLatitude && this.initialLongitude) {
      this.addMarker(this.initialLatitude, this.initialLongitude);
    }

    // Handle map click events
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.addMarker(lat, lng);
      this.locationSelected.emit({ lat, lng });
    });

    // Force map to render properly
    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 300);

    this.isMapInitialized = true;
  }

  private addMarker(lat: number, lng: number): void {
    // Remove existing marker if any
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add new marker
    this.marker = L.marker([lat, lng], {
      draggable: true
    }).addTo(this.map);

    // Handle marker drag events
    this.marker.on('dragend', () => {
      const position = this.marker!.getLatLng();
      this.locationSelected.emit({
        lat: position.lat,
        lng: position.lng
      });
    });
  }

  // Public method to update marker position programmatically
  updateMarkerPosition(lat: number, lng: number): void {
    if (lat && lng) {
      if (this.isMapInitialized && this.map) {
        this.addMarker(lat, lng);
        this.map.setView([lat, lng], this.initialZoom);
      } else {
        // Store these values for when the map initializes
        this.initialLatitude = lat;
        this.initialLongitude = lng;

        // Try to initialize the map now
        this.tryInitializeMap();
      }
    }
  }

  // Public method to force map refresh
  refreshMap(): void {
    if (!document.getElementById('map')) {
      console.warn('Map element not found during refresh');
      setTimeout(() => this.refreshMap(), 300);
      return;
    }

    if (this.isMapInitialized && this.map) {
      // Make sure the map container is visible before refreshing
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.style.display = 'block';
        mapElement.style.height = '400px';
      }

      setTimeout(() => {
        this.map.invalidateSize(true);

        // Re-center map on marker if exists
        if (this.marker) {
          const position = this.marker.getLatLng();
          this.map.setView([position.lat, position.lng], this.initialZoom);
        } else if (this.initialLatitude && this.initialLongitude) {
          this.map.setView([this.initialLatitude, this.initialLongitude], this.initialZoom);
        }
      }, 300);
    } else {
      this.tryInitializeMap();
    }
  }
}
