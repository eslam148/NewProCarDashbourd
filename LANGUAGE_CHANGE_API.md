# Language Change API Integration

This document describes the implementation of the language change API integration that synchronizes user language preferences with the backend.

## Overview

The language change functionality has been enhanced to support both local language switching and API-synchronized language preferences. When a user changes their language preference, it will be saved to the backend using the `/api/Profile/ChangeLanguage` endpoint.

## API Endpoint

```
PUT /api/Profile/ChangeLanguage?language={languageCode}
```

**Parameters:**
- `language`: Integer (1 for Arabic, 2 for English)

**Headers:**
- `Authorization`: Bearer {JWT_TOKEN}
- `Accept`: */*

**Example cURL:**
```bash
curl -X 'PUT' \
  'http://procare.runasp.net/api/Profile/ChangeLanguage?language=2' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

## Implementation Details

### 1. ProfileService

A new `ProfileService` has been created to handle profile-related API calls:

```typescript
// Change language via API
this.profileService.changeLanguage(2).subscribe(response => {
  console.log('Language changed successfully');
});

// Map language codes
const apiCode = this.profileService.mapLanguageToApiCode('ar'); // Returns 1
const langCode = this.profileService.mapApiCodeToLanguage(1); // Returns 'ar'
```

### 2. Enhanced TranslationService

The `TranslationService` now includes API integration:

```typescript
// Set language with API synchronization (for authenticated users)
this.translationService.setLanguageWithApi('ar');

// Set language locally only (for non-authenticated users)
this.translationService.setLanguage('ar');

// Check if language is being changed
this.translationService.getIsChangingLanguage().subscribe(isChanging => {
  console.log('Language changing:', isChanging);
});
```

### 3. NgRx Store Integration

New actions, reducers, and effects have been added:

**Actions:**
- `changeLanguageApi`: Initiates API language change
- `changeLanguageApiSuccess`: API call succeeded
- `changeLanguageApiFailure`: API call failed

**State:**
- `isChangingLanguage`: Boolean indicating if language change is in progress

### 4. Updated Components

#### LanguageSwitcherComponent
- Now uses `setLanguageWithApi()` for authenticated users
- Shows loading spinner during API calls
- Disables buttons during language change

#### MainLoginComponent
- Continues to use local language switching (user not authenticated)

## Usage Examples

### Basic Usage

```typescript
import { TranslationService } from './services/translation.service';

constructor(private translationService: TranslationService) {}

// Change language with API sync
changeToArabic() {
  this.translationService.setLanguageWithApi('ar');
}

// Change language locally only
changeToEnglishLocal() {
  this.translationService.setLanguage('en');
}
```

### With Loading State

```typescript
import { TranslationService } from './services/translation.service';

export class MyComponent {
  isChangingLanguage$ = this.translationService.getIsChangingLanguage();

  constructor(private translationService: TranslationService) {}

  changeLanguage(lang: string) {
    this.translationService.setLanguageWithApi(lang);
  }
}
```

```html
<button 
  (click)="changeLanguage('ar')" 
  [disabled]="isChangingLanguage$ | async">
  <span *ngIf="isChangingLanguage$ | async" class="spinner-border spinner-border-sm me-1"></span>
  العربية
</button>
```

### Direct API Call

```typescript
import { ProfileService } from './services/profile.service';

constructor(private profileService: ProfileService) {}

changeLanguageDirectly() {
  this.profileService.changeLanguage(1).subscribe({
    next: (response) => console.log('Success:', response),
    error: (error) => console.error('Error:', error)
  });
}
```

## Language Code Mapping

| Language | String Code | API Code |
|----------|-------------|----------|
| Arabic   | 'ar'        | 1        |
| English  | 'en'        | 2        |

## Error Handling

The system includes comprehensive error handling:

1. **Network Errors**: API failures are caught and logged
2. **Authentication Errors**: Falls back to local language switching
3. **Invalid Language Codes**: Defaults to English (2)

## Testing

Run the tests to ensure everything works correctly:

```bash
ng test --include="**/profile.service.spec.ts"
ng test --include="**/translation.service.spec.ts"
```

## Migration Notes

### For Existing Components

1. Replace `translationService.setLanguage()` with `translationService.setLanguageWithApi()` for authenticated users
2. Add loading state handling if needed
3. Update templates to show loading indicators

### For New Components

1. Use `setLanguageWithApi()` for authenticated contexts
2. Use `setLanguage()` for non-authenticated contexts (login page, etc.)
3. Subscribe to `getIsChangingLanguage()` for loading states

## Files Modified/Created

### New Files:
- `src/app/services/profile.service.ts`
- `src/app/services/profile.service.spec.ts`
- `src/app/examples/language-change-example.component.ts`

### Modified Files:
- `src/app/store/translation/translation.actions.ts`
- `src/app/store/translation/translation.reducer.ts`
- `src/app/store/translation/translation.effects.ts`
- `src/app/store/translation/translation.selectors.ts`
- `src/app/services/translation.service.ts`
- `src/app/components/language-switcher/language-switcher.component.ts`
- `src/app/pages/main-login/main-login.component.ts`

## Future Enhancements

1. **Offline Support**: Queue language changes when offline
2. **Bulk Operations**: Support changing multiple preferences at once
3. **User Preferences**: Extend to other user preference settings
4. **Analytics**: Track language usage patterns
