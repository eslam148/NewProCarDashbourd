import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-wrapper" [class]="avatarClass">
      <img
        *ngIf="hasValidImage(); else defaultAvatar"
        [src]="imageUrl"
        [alt]="altText"
        [class]="'avatar-img ' + getSizeClass()"
        (error)="onImageError($event)"
        loading="lazy">

      <ng-template #defaultAvatar>
        <div
          [class]="'avatar-default ' + getSizeClass()"
          [style.background-color]="avatarBackgroundColor"
          [innerHTML]="defaultAvatarContent">
        </div>
      </ng-template>

      
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    .avatar-wrapper {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f8f9fa;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
    }

    .avatar-default {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }

    /* Size classes */
    .size-sm {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }

    .size-md {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    .size-lg {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }

    .size-xl {
      width: 56px;
      height: 56px;
      font-size: 24px;
    }

    .size-large {
      width: 150px;
      height: 150px;
      font-size: 54px;
    }

    /* Status indicator */
    .avatar-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 25%;
      border-radius: 50%;
      border: 2px solid white;
    }

    .status-success { background-color: #28a745; }
    .status-danger { background-color: #dc3545; }
    .status-warning { background-color: #ffc107; }
    .status-info { background-color: #17a2b8; }
    .status-primary { background-color: #007bff; }
    .status-secondary { background-color: #6c757d; }
    .status-dark { background-color: #343a40; }
    .status-light { background-color: #f8f9fa; }

    /* Profile avatar large class support */
    .profile-avatar-large {
      width: 150px !important;
      height: 150px !important;
      border: 4px solid var(--cui-border-color, #dee2e6);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }

      .avatar-img, .avatar-default {
        width: 150px;
        height: 150px;
        font-size: 54px;
      }
    }
  `]
})
export class UserAvatarComponent implements OnInit {
  @Input() imageUrl?: string;
  @Input() firstName?: string;
  @Input() lastName?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shape: 'rounded' | 'rounded-circle' | 'rounded-0' | 'rounded-1' | 'rounded-2' | 'rounded-3' = 'rounded-circle';
  @Input() status?: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'dark' | 'light';
  @Input() textColor: string = 'primary';
  @Input() avatarClass: string = '';
  @Input() altText: string = '';

  // Computed properties for template
  avatarBackgroundColor: string = '#6c757d';
  defaultAvatarContent: string = '<span>U</span>';

  ngOnInit() {
    if (!this.altText) {
      this.altText = this.getFullName() || 'User Avatar';
    }

    // Calculate computed properties
    this.avatarBackgroundColor = this.getAvatarBackgroundColor();
    this.defaultAvatarContent = this.getDefaultAvatarSvg();

    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && window.console) {
      console.log('UserAvatar initialized:', {
        imageUrl: this.imageUrl,
        firstName: this.firstName,
        lastName: this.lastName,
        size: this.size,
        avatarClass: this.avatarClass
      });
    }
  }

  getAvatarSrc(): string {
    if (this.imageUrl) {
      return this.imageUrl;
    }
    return this.getDefaultAvatarDataUrl();
  }

  getSizeClass(): string {
    if (this.avatarClass?.includes('profile-avatar-large')) {
      return 'size-large';
    }
    return `size-${this.size}`;
  }

  getDefaultAvatarSvg(): string {
    const initials = this.getInitials();
    return `<span style="user-select: none;">${initials}</span>`;
  }

  hasValidImage(): boolean {
    return !!(this.imageUrl && this.imageUrl.trim() !== '');
  }

  private getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  private getInitials(): string {
    const firstName = this.firstName || '';
    const lastName = this.lastName || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    if (firstInitial && lastInitial) {
      return firstInitial + lastInitial;
    } else if (firstInitial) {
      return firstInitial;
    } else if (lastInitial) {
      return lastInitial;
    } else {
      return 'U';
    }
  }

  getAvatarBackgroundColor(): string {
    const name = ((this.firstName || '') + (this.lastName || '')).toLowerCase();

    if (!name) return '#6c757d';
    
    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert hash to a pleasant color
    const colors = [
      '#007bff', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997',
      '#6610f2', '#dc3545', '#28a745', '#17a2b8', '#ffc107'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }

  private getDefaultAvatarDataUrl(): string {
    const initials = this.getInitials();
    const backgroundColor = this.getAvatarBackgroundColor();

    // Determine size for SVG based on avatar size or class
    let svgSize = 40;
    let fontSize = 16;

    // Check if this is a large profile avatar
    if (this.avatarClass?.includes('profile-avatar-large')) {
      svgSize = 150;
      fontSize = 54;
    } else {
      switch (this.size) {
        case 'sm':
          svgSize = 32;
          fontSize = 12;
          break;
        case 'md':
          svgSize = 40;
          fontSize = 16;
          break;
        case 'lg':
          svgSize = 48;
          fontSize = 20;
          break;
        case 'xl':
          svgSize = 56;
          fontSize = 24;
          break;
      }
    }
    
    const svg = `
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%; overflow: hidden;">
        <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${svgSize/2}" fill="${backgroundColor}"/>
        <text x="${svgSize/2}" y="${svgSize/2}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
              text-anchor="middle" dominant-baseline="central" fill="white"
              style="user-select: none;">
          ${initials}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      // Hide the broken image and show default avatar
      imgElement.style.display = 'none';
      this.imageUrl = undefined; // This will trigger the default avatar template
    }
  }
}
