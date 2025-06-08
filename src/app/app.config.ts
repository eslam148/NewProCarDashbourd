import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { authInterceptor } from './interceptors/auth.interceptor';
import { languageInterceptor } from './interceptors/language.interceptor';
import { serviceCategoryReducer } from './store/service-category/service-category.reducer';
import { subCategoryReducer } from './store/sub-category/sub-category.reducer';
import { serviceCatalogReducer } from './store/service-catalog/service-catalog.reducer';
import { ServiceCategoryEffects } from './store/service-category/service-category.effects';
import { SubCategoryEffects } from './store/sub-category/sub-category.effects';
import { ServiceCatalogEffects } from './store/service-catalog/service-catalog.effects';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { translationReducer } from './store/translation/translation.reducer';
import { TranslationEffects } from './store/translation/translation.effects';
import { governorateReducer } from './store/governorate/governorate.reducer';
import { GovernorateEffects } from './store/governorate/governorate.effects';
import { adminReducer } from './store/admin/admin.reducer';
import { AdminEffects } from './store/admin/admin.effects';
import { cityReducer } from './store/city/city.reducer';
import { CityEffects } from './store/city/city.effects';
import { profileReducer } from './store/profile/profile.reducer';
import { ProfileEffects } from './store/profile/profile.effects';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { SidebarNavHelper } from '@coreui/angular';
import { TranslationService } from './services/translation.service';
import { ThemeService } from './services/theme.service';

import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { firebaseConfig } from './firebase-config';

import { provideFirebaseApp } from '@angular/fire/app';
import { provideMessaging } from '@angular/fire/messaging';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideStore({
      serviceCategory: serviceCategoryReducer,
      subCategory: subCategoryReducer,
      serviceCatalog: serviceCatalogReducer,
      auth: authReducer,
      translation: translationReducer,
      governorate: governorateReducer,
      admin: adminReducer,
      city: cityReducer,
      profile: profileReducer
    }),
    provideEffects(
      ServiceCategoryEffects,
      SubCategoryEffects,
      ServiceCatalogEffects,
      AuthEffects,
      TranslationEffects,
      GovernorateEffects,
      AdminEffects,
      CityEffects,
      ProfileEffects
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Note: languageInterceptor is available as an alternative if you want to separate concerns
    // provideHttpClient(withInterceptors([authInterceptor, languageInterceptor])),
     provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideMessaging(() => getMessaging()),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      IconModule
    ),
    IconSetService,
    SidebarNavHelper,
    TranslationService,
    ThemeService
  ]
  
};
