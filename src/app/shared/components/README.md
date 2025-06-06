# Shared Components Guide

This directory contains reusable components for consistent UI across the application.

## ActionButtonComponent

### Overview
The `ActionButtonComponent` provides a **standardized button style** across the application with support for icons, translations, loading states, and various styling options. This component ensures **consistent button colors, shapes, and behavior** throughout the entire application.

### 🎨 **Standardized Color Scheme**

All buttons across the application should follow this color scheme for consistency:

| Color | Usage | Examples |
|-------|-------|----------|
| `primary` | Main actions | Add, Save, Update, Submit, Edit |
| `secondary` | Secondary actions | Cancel, Close, Reset |
| `success` | Positive confirmations | Confirm, Approve, Accept |
| `danger` | Destructive actions | Delete, Remove, Reject |
| `warning` | Caution actions | Warning, Alert, Caution |
| `info` | Informational actions | View, Details, Info |
| `light` | Neutral actions | Clear, Neutral |
| `dark` | Alternative primary | Alternative styling |

### 🔧 **Default Settings**
- **Shape**: `rounded-pill` (consistent pill-shaped buttons)
- **Size**: Standard (38px height)
- **Hover Effects**: Consistent elevation and shadow
- **Icons**: CoreUI icons with proper spacing

### Usage

1. Import the component in your page:

```typescript
// Direct import
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';

// OR using the barrel file (recommended)
import { ActionButtonComponent } from '../../shared/components';

@Component({
  // ...
  imports: [
    // other imports...
    ActionButtonComponent
  ]
})
```

2. Use it in your template:

```html
<!-- ✅ STANDARDIZED EXAMPLES -->

<!-- Add/Create Button (Primary) -->
<app-action-button
  color="primary"
  icon="cilPlus"
  text="common.create"
  (clicked)="onCreate()"
></app-action-button>

<!-- Edit Button (Primary) -->
<app-action-button
  color="primary"
  icon="cilPencil"
  text="common.edit"
  size="sm"
  (clicked)="onEdit(item)"
></app-action-button>

<!-- Delete Button (Danger) -->
<app-action-button
  color="danger"
  icon="cilTrash"
  text="common.delete"
  size="sm"
  tooltip="common.delete"
  (clicked)="onDelete(item)"
></app-action-button>

<!-- Save/Submit Button (Primary) -->
<app-action-button
  color="primary"
  type="submit"
  icon="cilSave"
  text="common.save"
  [disabled]="form.invalid"
></app-action-button>

<!-- Cancel Button (Secondary) -->
<app-action-button
  color="secondary"
  icon="cilX"
  text="common.cancel"
  (clicked)="onCancel()"
></app-action-button>

<!-- Confirm Button (Success) -->
<app-action-button
  color="success"
  icon="cilCheck"
  text="common.confirm"
  (clicked)="onConfirm()"
></app-action-button>

<!-- View/Info Button (Info) -->
<app-action-button
  color="info"
  icon="cilMagnifyingGlass"
  text="common.view"
  variant="outline"
  (clicked)="onView(item)"
></app-action-button>

<!-- Icon-only button with tooltip -->
<app-action-button
  color="light"
  icon="cilInfo"
  tooltip="common.infoTooltip"
  iconOnly="true"
  (clicked)="showInfo()"
></app-action-button>

<!-- Loading state -->
<app-action-button
  color="primary"
  icon="cilReload"
  text="common.refresh"
  [loading]="isLoading"
  (clicked)="refresh()"
></app-action-button>
```

### Properties

| Property   | Type      | Default    | Description |
|------------|-----------|------------|-------------|
| text       | string    | ''         | Translation key for button text |
| color      | string    | 'primary'  | Button color: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark' |
| icon       | string    | ''         | CoreUI icon name (e.g., 'cilPlus') |
| tooltip    | string    | ''         | Translation key for tooltip text |
| shape      | string    | ''         | Button shape: 'rounded-pill', 'rounded', '' |
| size       | string    | ''         | Button size: 'sm', 'lg', '' |
| variant    | string    | ''         | Button variant: 'ghost', 'outline', '' |
| disabled   | boolean   | false      | Whether the button is disabled |
| loading    | boolean   | false      | Whether to show a loading spinner |
| block      | boolean   | false      | Whether the button is full width |
| iconOnly   | boolean   | false      | Whether to show only the icon |
| type       | string    | 'button'   | Button type: 'button', 'submit', 'reset' |

### Events

| Event      | Description |
|------------|-------------|
| clicked    | Emitted when the button is clicked |

## Best Practices

1. **Always use translation keys**: Don't hardcode text values directly in buttons
2. **Use consistent styling**: Follow the existing patterns in the application
3. **Use appropriate colors**: 
   - `primary`: Main actions
   - `secondary`: Alternative/cancel actions
   - `success`: Confirmation/completion actions
   - `danger`: Destructive actions
   - `warning`: Alert actions
   - `info`: Informational actions
4. **Use consistent icon naming**: Follow the CoreUI icon naming convention (e.g., 'cilPlus')
5. **Add tooltips for icon-only buttons**: Ensure accessibility

## Icons

All icons are registered globally in the app.component.ts file. Available icons include:

- cilPlus - Add
- cilPencil - Edit
- cilTrash - Delete
- cilSave - Save
- cilX - Cancel/Close
- cilCheck - Confirm
- cilWarning - Warning
- cilBan - Forbidden
- cilMagnifyingGlass - Search
- cilReload - Refresh
- cilFilter - Filter
- cilSettings - Settings
- ... and many more

## Examples in Context

### Create/Edit Form Buttons

```html
<div class="mt-3 d-flex gap-2">
  <app-action-button
    color="primary"
    type="submit"
    [icon]="isEditMode ? 'cilPencil' : 'cilPlus'"
    [text]="isEditMode ? 'common.update' : 'common.create'"
    [disabled]="form.invalid"
  ></app-action-button>
  
  <app-action-button
    color="secondary"
    icon="cilX"
    text="common.cancel"
    (clicked)="onCancel()"
  ></app-action-button>
</div>
```

### Table Actions

```html
<td class="actions-cell">
  <div class="d-flex gap-2">
    <app-action-button
      color="primary"
      size="sm"
      icon="cilPencil"
      tooltip="common.edit" 
      iconOnly="true"
      (clicked)="onEdit(item)"
    ></app-action-button>
    
    <app-action-button
      color="danger"
      size="sm"
      icon="cilTrash"
      tooltip="common.delete"
      iconOnly="true"
      (clicked)="onDelete(item)"
    ></app-action-button>
  </div>
</td>
```

### Modal Buttons

```html
<c-modal-footer>
  <app-action-button
    color="secondary"
    icon="cilX"
    text="common.cancel"
    (clicked)="closeModal()"
  ></app-action-button>
  
  <app-action-button
    color="primary"
    icon="cilCheck"
    text="common.confirm"
    (clicked)="confirmAction()"
  ></app-action-button>
</c-modal-footer>
``` 
