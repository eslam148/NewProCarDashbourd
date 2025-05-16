import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslationService } from './translation.service';
import { setLanguage, loadTranslations } from '../store/translation/translation.actions';
import { selectCurrentLanguage, selectTranslations } from '../store/translation/translation.selectors';
import { environment } from '../../environments/environment';

describe('TranslationService', () => {
  let service: TranslationService;
  let store: MockStore;
  let mockTranslations: any;

  beforeEach(() => {
    mockTranslations = {
      common: {
        welcome: 'Welcome',
        hello: 'Hello {0}'
      }
    };

    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        provideMockStore({
          selectors: [
            { selector: selectCurrentLanguage, value: 'en' },
            { selector: selectTranslations, value: mockTranslations }
          ]
        })
      ]
    });

    service = TestBed.inject(TranslationService);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language from localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('ar');
    const newService = new TranslationService(store);
    expect(store.dispatch).toHaveBeenCalledWith(setLanguage({ language: 'ar' }));
  });

  it('should set language and update localStorage', () => {
    service.setLanguage('fr');
    expect(localStorage.setItem).toHaveBeenCalledWith('app_language', 'fr');
    expect(store.dispatch).toHaveBeenCalledWith(setLanguage({ language: 'fr' }));
    expect(store.dispatch).toHaveBeenCalledWith(loadTranslations({ language: 'fr' }));
  });

  it('should not set unsupported language', () => {
    const unsupportedLang = 'xyz';
    service.setLanguage(unsupportedLang);
    expect(store.dispatch).toHaveBeenCalledWith(setLanguage({ language: environment.defaultLanguage }));
  });

  it('should get current language', (done) => {
    service.getCurrentLang().subscribe(lang => {
      expect(lang).toBe('en');
      done();
    });
  });

  it('should translate simple key', (done) => {
    service.translate('common.welcome').subscribe(translation => {
      expect(translation).toBe('Welcome');
      done();
    });
  });

  it('should translate key with parameters', (done) => {
    service.translate('common.hello', ['John']).subscribe(translation => {
      expect(translation).toBe('Hello John');
      done();
    });
  });

  it('should return key if translation not found', (done) => {
    service.translate('nonexistent.key').subscribe(translation => {
      expect(translation).toBe('nonexistent.key');
      done();
    });
  });

  it('should set RTL direction for Arabic language', () => {
    service.setLanguage('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should set LTR direction for non-Arabic language', () => {
    service.setLanguage('en');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
