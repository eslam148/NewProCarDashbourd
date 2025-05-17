import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { INavData } from '@coreui/angular';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,


    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ShadowOnScrollDirective,
    AsyncPipe,
    TranslatePipe
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;

  // Track which submenus are currently expanded
  private activeSubmenus: Set<HTMLElement> = new Set();

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Check for active routes and expand the corresponding submenus on init
    setTimeout(() => {
      this.initActiveSubmenus();
    }, 100);
  }

  /**
   * Returns the appropriate icon class based on the navigation item
   * @param item The navigation item
   * @returns The CSS class for the icon
   */
  getIconClass(item: any): string {
    if (!item || !item.iconComponent) return '';

    const iconName = item.iconComponent.name;

    // Map icon names to CSS classes
    const iconClasses: { [key: string]: string } = {
      'cil-speedometer': 'icon-dashboard',
      'cil-user': 'icon-admin',
      'cil-location-pin': 'icon-location',
      'cil-list': 'icon-category',
      'cil-medical-cross': 'icon-specialty',
      'cil-inbox': 'icon-requests',
      'cil-people': 'icon-nurse'
    };

    return iconClasses[iconName] || '';
  }

  /**
   * Toggles a submenu open/closed state
   */
  toggleSubmenu(event: MouseEvent): void {
    // Get the clicked element
    const target = event.currentTarget as HTMLElement;

    // Get the parent li element
    const menuItem = target.closest('.has-submenu') as HTMLElement;

    if (!menuItem) return;

    // Get the submenu
    const submenu = menuItem.querySelector('.sidebar-subnav') as HTMLElement;

    if (!submenu) return;

    // Toggle the active class
    if (menuItem.classList.contains('open')) {
      this.renderer.removeClass(menuItem, 'open');
      this.activeSubmenus.delete(menuItem);

      // Animate the submenu closed
      this.renderer.setStyle(submenu, 'height', `${submenu.scrollHeight}px`);
      setTimeout(() => {
        this.renderer.setStyle(submenu, 'height', '0px');
      }, 10);
    } else {
      this.renderer.addClass(menuItem, 'open');
      this.activeSubmenus.add(menuItem);

      // Animate the submenu open
      this.renderer.setStyle(submenu, 'height', '0px');
      setTimeout(() => {
        this.renderer.setStyle(submenu, 'height', `${submenu.scrollHeight}px`);
        setTimeout(() => {
          this.renderer.setStyle(submenu, 'height', 'auto');
        }, 300);
      }, 10);
    }
  }

  /**
   * Initialize active submenus based on current route
   */
  private initActiveSubmenus(): void {
    // Find all links that have the active class
    const activeLinks = document.querySelectorAll('.sidebar-link.active');

    activeLinks.forEach(link => {
      // Find the parent submenu if it exists
      const parentSubmenu = link.closest('.has-submenu');
      if (parentSubmenu) {
        // Trigger the click to open the submenu
        this.renderer.addClass(parentSubmenu, 'open');
        const submenu = parentSubmenu.querySelector('.sidebar-subnav') as HTMLElement;
        if (submenu) {
          this.renderer.setStyle(submenu, 'height', 'auto');
        }
      }
    });
  }
}
