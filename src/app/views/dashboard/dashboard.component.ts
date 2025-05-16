import { DOCUMENT, NgStyle, CommonModule, NgClass } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { importProvidersFrom } from '@angular/core';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { ChartService, ChartData } from '../../services/chart.service';
import { getStyle, hexToRgba } from '@coreui/utils';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

interface IVehicle {
  id: string;
  model: string;
  status: string;
  statusColor: string;
  lastService: string;
  mileage: number;
  mileagePercent: number;
  mileageColor: string;
  fuelPercent: number;
  fuelColor: string;
}

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    imports: [
      CommonModule,
      NgClass,
      WidgetsDropdownComponent,
      TextColorDirective,
      CardComponent,
      CardBodyComponent,
      RowComponent,
      ColComponent,
      ButtonDirective,
      IconDirective,
      ReactiveFormsModule,
      ButtonGroupComponent,
      FormCheckLabelDirective,
      ChartjsComponent,
      NgStyle,
      CardFooterComponent,
      GutterDirective,
      ProgressBarDirective,
      ProgressComponent,
      WidgetsBrandComponent,
      CardHeaderComponent,
      TableDirective,
      AvatarComponent,
      BadgeComponent

    ]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  readonly #iconSetService: IconSetService = inject(IconSetService);
  readonly #chartService: ChartService = inject(ChartService);

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/images/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/images/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/images/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  // Vehicle metrics
  selectedVehicle: string = 'all';
  showVehicleDetails: boolean = true;
  vehicleData: IVehicle[] = [
    {
      id: 'V-001',
      model: 'Tesla Model S',
      status: 'Active',
      statusColor: 'success',
      lastService: '2023-05-15',
      mileage: 45892,
      mileagePercent: 65,
      mileageColor: 'success',
      fuelPercent: 78,
      fuelColor: 'info'
    },
    {
      id: 'V-002',
      model: 'Ford Mustang Mach-E',
      status: 'Maintenance',
      statusColor: 'warning',
      lastService: '2023-04-02',
      mileage: 32456,
      mileagePercent: 42,
      mileageColor: 'success',
      fuelPercent: 32,
      fuelColor: 'danger'
    },
    {
      id: 'V-003',
      model: 'BMW i4',
      status: 'Inactive',
      statusColor: 'danger',
      lastService: '2023-06-20',
      mileage: 12340,
      mileagePercent: 18,
      mileageColor: 'success',
      fuelPercent: 95,
      fuelColor: 'success'
    },
    {
      id: 'V-004',
      model: 'Audi e-tron',
      status: 'Active',
      statusColor: 'success',
      lastService: '2023-03-10',
      mileage: 58932,
      mileagePercent: 78,
      mileageColor: 'warning',
      fuelPercent: 45,
      fuelColor: 'warning'
    }
  ];

  // Vehicle charts
  vehicleCharts: any = {
    performance: {
      data: {},
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              maxTicksLimit: 5,
              stepSize: 20
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      }
    },
    maintenance: {
      data: {},
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    },
    distribution: {
      data: {},
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        cutout: '70%'
      }
    }
  };

  // Tab control for vehicle charts
  activeTab: string = 'performance';

  constructor() {
    this.initCharts();
  }

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.initVehicleCharts();
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

  selectVehicle(type: string): void {
    this.selectedVehicle = type;

    // In a real app, you would filter data based on vehicle type
    // This is a simplified example
    if (type === 'all') {
      this.showVehicleDetails = true;
    } else if (type === 'fleet') {
      this.showVehicleDetails = true;
      // Filter for fleet vehicles
    } else if (type === 'private') {
      this.showVehicleDetails = true;
      // Filter for private vehicles
    }
  }

  private initVehicleCharts(): void {
    this.#chartService.getVehiclePerformanceData()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => {
        this.vehicleCharts.performance.data = data;
      });

    this.#chartService.getMaintenanceData()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => {
        this.vehicleCharts.maintenance.data = data;
      });

    this.#chartService.getVehicleDistributionData()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(data => {
        this.vehicleCharts.distribution.data = data;
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
