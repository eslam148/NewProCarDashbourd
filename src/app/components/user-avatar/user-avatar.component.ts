import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '@coreui/angular';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  template: `
    <c-avatar
      [class]="avatarClass"
      [size]="size"
      [shape]="shape"
      [src]="getAvatarSrc()"
      [alt]="altText"
      [status]="status"
      [textColor]="textColor"
      (error)="onImageError($event)">
    </c-avatar>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    c-avatar {
      border-radius: 50% !important;
      overflow: hidden;
    }

    c-avatar img {
      border-radius: 50% !important;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    c-avatar .avatar-img {
      border-radius: 50% !important;
      object-fit: cover;
      width: 100%;
      height: 100%;
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

  ngOnInit() {
    if (!this.altText) {
      this.altText = this.getFullName() || 'User Avatar';
    }
  }

  getAvatarSrc(): string {
    if (this.imageUrl) {
      return this.imageUrl;
    }
    return this.getDefaultAvatarDataUrl();
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

  private getAvatarBackgroundColor(): string {
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
      imgElement.src = this.getDefaultAvatarDataUrl();
    }
  }
}
