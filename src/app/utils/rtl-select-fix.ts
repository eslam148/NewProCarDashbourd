/**
 * RTL Select Fix Utility
 * Ensures all select elements work properly in RTL mode
 */

export class RTLSelectFix {
  
  /**
   * Apply RTL fixes to all select elements in the document
   */
  static applyRTLToAllSelects(): void {
    if (typeof document === 'undefined') return;
    
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
    if (isRTL) {
      this.fixAllSelectElements();
      this.observeNewSelects();
    }
  }
  
  /**
   * Fix all existing select elements
   */
  private static fixAllSelectElements(): void {
    const selectors = [
      'select',
      '.form-select',
      '[cSelect]',
      '.custom-select',
      '.bootstrap-select',
      'input[type="select"]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.applyRTLToElement(element as HTMLElement);
      });
    });
  }
  
  /**
   * Apply RTL styling to a specific element
   */
  private static applyRTLToElement(element: HTMLElement): void {
    if (!element) return;
    
    const isDarkMode = document.documentElement.getAttribute('data-coreui-theme') === 'dark';
    const arrowColor = isDarkMode ? '%23ffffff' : '%23343a40';
    
    const styles = {
      'text-align': 'right',
      'direction': 'rtl',
      'background-position': 'left 0.75rem center',
      'padding-left': '2.25rem',
      'padding-right': '0.75rem',
      'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='${arrowColor}' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e")`,
      'background-repeat': 'no-repeat',
      'background-size': '16px 12px',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'appearance': 'none'
    };
    
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
    
    // Fix options if it's a select element
    if (element.tagName.toLowerCase() === 'select') {
      const options = element.querySelectorAll('option');
      options.forEach(option => {
        (option as HTMLElement).style.setProperty('text-align', 'right', 'important');
        (option as HTMLElement).style.setProperty('direction', 'rtl', 'important');
      });
    }
  }
  
  /**
   * Observe for new select elements added to the DOM
   */
  private static observeNewSelects(): void {
    if (typeof MutationObserver === 'undefined') return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check if the added element is a select
            if (this.isSelectElement(element)) {
              this.applyRTLToElement(element);
            }
            
            // Check for select elements within the added element
            const selects = element.querySelectorAll('select, .form-select, [cSelect]');
            selects.forEach(select => {
              this.applyRTLToElement(select as HTMLElement);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Check if an element is a select element
   */
  private static isSelectElement(element: HTMLElement): boolean {
    const selectSelectors = [
      'select',
      '.form-select',
      '[cSelect]',
      '.custom-select',
      '.bootstrap-select'
    ];
    
    return selectSelectors.some(selector => {
      if (selector.startsWith('.')) {
        return element.classList.contains(selector.substring(1));
      } else if (selector.startsWith('[') && selector.endsWith(']')) {
        const attr = selector.slice(1, -1);
        return element.hasAttribute(attr);
      } else {
        return element.tagName.toLowerCase() === selector;
      }
    });
  }
  
  /**
   * Update select elements when theme changes
   */
  static updateSelectsForThemeChange(): void {
    if (typeof document === 'undefined') return;
    
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
    if (isRTL) {
      this.fixAllSelectElements();
    }
  }
  
  /**
   * Initialize RTL select fixes
   */
  static initialize(): void {
    if (typeof document === 'undefined') return;
    
    // Apply fixes immediately
    this.applyRTLToAllSelects();
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.applyRTLToAllSelects();
      });
    }
    
    // Apply fixes when language changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          setTimeout(() => {
            this.applyRTLToAllSelects();
          }, 100);
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-coreui-theme') {
          setTimeout(() => {
            this.updateSelectsForThemeChange();
          }, 100);
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'data-coreui-theme']
    });
  }
}
