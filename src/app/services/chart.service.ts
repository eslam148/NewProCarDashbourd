import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils';
import { Observable, of } from 'rxjs';

export interface ChartData {
  labels: string[];
  datasets: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }

  getVehiclePerformanceData(): Observable<ChartData> {
    const vehicleData: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Fuel Consumption (L/100km)',
          backgroundColor: hexToRgba(getStyle('--cui-info') || '#3399ff', 10),
          borderColor: getStyle('--cui-info') || '#3399ff',
          pointHoverBackgroundColor: getStyle('--cui-info') || '#3399ff',
          borderWidth: 2,
          data: [7.2, 6.9, 7.5, 8.1, 7.3, 6.8, 7.0, 7.2, 7.5, 7.8, 7.1, 6.9],
          fill: true,
          tension: 0.4
        },
        {
          label: 'Average Speed (km/h)',
          backgroundColor: 'transparent',
          borderColor: getStyle('--cui-success') || '#4dbd74',
          pointHoverBackgroundColor: getStyle('--cui-success') || '#4dbd74',
          borderWidth: 2,
          data: [49, 52, 55, 58, 56, 55, 53, 54, 56, 58, 57, 55],
          tension: 0.4
        },
        {
          label: 'Distance Traveled (km × 100)',
          backgroundColor: 'transparent',
          borderColor: getStyle('--cui-warning') || '#f9b115',
          pointHoverBackgroundColor: getStyle('--cui-warning') || '#f9b115',
          borderWidth: 2,
          data: [9.2, 10.5, 11.3, 12.5, 11.1, 10.8, 11.2, 12.0, 11.5, 11.8, 12.1, 12.5],
          tension: 0.4
        }
      ]
    };

    return of(vehicleData);
  }

  getMaintenanceData(): Observable<ChartData> {
    const maintenanceData: ChartData = {
      labels: ['Engine', 'Transmission', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Climate'],
      datasets: [
        {
          label: 'Health Status (%)',
          backgroundColor: [
            getStyle('--cui-success') || '#4dbd74',
            getStyle('--cui-info') || '#3399ff',
            getStyle('--cui-warning') || '#f9b115',
            getStyle('--cui-success') || '#4dbd74',
            getStyle('--cui-primary') || '#321fdb',
            getStyle('--cui-success') || '#4dbd74',
            getStyle('--cui-danger') || '#e55353'
          ],
          data: [95, 92, 78, 89, 96, 98, 72]
        }
      ]
    };

    return of(maintenanceData);
  }

  getVehicleDistributionData(): Observable<ChartData> {
    const distributionData: ChartData = {
      labels: ['Sedan', 'SUV', 'Truck', 'Van', 'Electric'],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            getStyle('--cui-info') || '#3399ff',
            getStyle('--cui-success') || '#4dbd74',
            getStyle('--cui-warning') || '#f9b115',
            getStyle('--cui-primary') || '#321fdb',
            getStyle('--cui-danger') || '#e55353'
          ],
          hoverBackgroundColor: [
            hexToRgba(getStyle('--cui-info') || '#3399ff', 90),
            hexToRgba(getStyle('--cui-success') || '#4dbd74', 90),
            hexToRgba(getStyle('--cui-warning') || '#f9b115', 90),
            hexToRgba(getStyle('--cui-primary') || '#321fdb', 90),
            hexToRgba(getStyle('--cui-danger') || '#e55353', 90)
          ]
        }
      ]
    };

    return of(distributionData);
  }
}
