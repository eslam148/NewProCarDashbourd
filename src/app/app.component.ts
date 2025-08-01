import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { checkAuth } from './store/auth/auth.actions';
import { selectAuthResponse } from './store/auth/auth.selectors';
import { ThemeService } from './services/theme.service';
import { RTLSelectFix } from './utils/rtl-select-fix';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { fixLeafletIcons } from './leaflet-fix';
import {
  cilHome,
  cilUser,
  cilPeople,
  cilMedicalCross,
  cilSpeedometer,
  cilSettings,
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilX,
  cilCheck,
  cilWarning,
  cilBan,
  cilLocationPin,
  cilCalendar,
  cilBell,
  cilOptions,
  cilMenu,
  cilList,
  cilMap,
  cilInfo,
  cilDescription,
  cilClock,
  cilTask,
  cilNotes,
  cilFilter,
  cilCloudUpload,
  cilSave,
  cilReload,
  cilChevronBottom,
  cilChevronTop,
  cilChevronLeft,
  cilChevronRight,
  cilMagnifyingGlass,
  cilStar,
  cilPhone
} from '@coreui/icons';

@Component({
    selector: 'app-root',
    template: '<router-outlet />',
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'ProCare';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);
  readonly #store = inject(Store);
  readonly #themeService = inject(ThemeService);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);
  readonly #platformId = inject(PLATFORM_ID);

  constructor() {
    this.#titleService.setTitle(this.title);

    // Enhanced icon registration to ensure all icons are properly loaded
    if (isPlatformBrowser(this.#platformId)) {
      // Register all icon sets
      this.#iconSetService.icons = {
        ...freeSet,
        ...brandSet,
        ...flagSet,
        ...iconSubset
      };

      // Force icon set update
      setTimeout(() => {
        // This timeout ensures the icons are properly registered after the DOM is ready
        this.#iconSetService.icons = {
          ...this.#iconSetService.icons
        };
      }, 100);
    }

    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    // Register all icons for use across the application
    this.#iconSetService.icons = {
      cilHome,
      cilUser,
      cilPeople,
      cilMedicalCross,
      cilSpeedometer,
      cilSettings,
      cilPlus,
      cilPencil,
      cilTrash,
      cilSearch,
      cilX,
      cilCheck,
      cilWarning,
      cilBan,
      cilLocationPin,
      cilCalendar,
      cilBell,
      cilOptions,
      cilMenu,
      cilList,
      cilMap,
      cilInfo,
      cilDescription,
      cilClock,
      cilTask,
      cilNotes,
      cilFilter,
      cilCloudUpload,
      cilSave,
      cilReload,
      cilChevronBottom,
      cilChevronTop,
      cilChevronLeft,
      cilChevronRight,
      cilMagnifyingGlass,
      cilStar,
      cilPhone
    };
  }

  ngOnInit(): void {
    // Check authentication state on app initialization
    // This will populate the store with auth data if available
    console.log('App component: Dispatching checkAuth');
    this.#store.dispatch(checkAuth());

    // Fix Leaflet icon paths and initialize RTL select fixes
    if (isPlatformBrowser(this.#platformId)) {
      fixLeafletIcons();

      // Initialize RTL select fixes for all select elements
      RTLSelectFix.initialize();
    }

    this.#router.events.pipe(
        takeUntilDestroyed(this.#destroyRef)
      ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const rt = this.getChild(this.#router.routerState.root);
      const routeTitle = rt?.snapshot.data['title'] || '';
      if (routeTitle) {
        this.#titleService.setTitle(`${this.title} | ${routeTitle}`);
      } else {
        this.#titleService.setTitle(this.title);
      }
    });
  }

  getChild(activatedRoute: any): any {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }
}
