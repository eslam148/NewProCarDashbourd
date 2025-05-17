// Barrel file to export all shared components
// This makes importing multiple components easier

/**
 * @fileoverview
 * This barrel file exports all shared components for easy importing across the application.
 * Import shared components like this: import { DataTableComponent, ActionButtonComponent } from '../../shared/components';
 */

export * from './data-table/data-table.component';
export * from './dynamic-form/dynamic-form.component';
export * from './action-button/action-button.component';
export * from './pagination/pagination.component';
// Uncomment when map-selector component is created
// export * from './map-selector/map-selector.component';

// Add any new shared components to this file
