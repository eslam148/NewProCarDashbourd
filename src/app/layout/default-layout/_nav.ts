import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [

  {
    name: 'admin.title',
    url: '/admins',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'disease.title',
    url: '/disease',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'pharmacy.title',
    url: '/pharmacy',
    iconComponent: { name: 'cil-user' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'location.title',
    url: '/location',
    iconComponent: { name: 'cil-location-pin' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'serviceCategory.title',
    url: '/servicecategory',
    iconComponent: { name: 'cil-list' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'specialty.title',
    url: '/specialty',
    iconComponent: { name: 'cil-medical-cross' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'requests.total',
    url: '/request',
    iconComponent: { name: 'cil-inbox' },
    badge: { color: 'info', text: 'NEW' }
  },
  {
    name: 'nurse.title',
    url: '/nurse',
    iconComponent: { name: 'cil-people' },
    badge: { color: 'info', text: 'NEW' }
  },

  {
    title: true,
    name: 'theme.light'
  },
  {
    name: 'common.colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'common.typography',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'common.components',
    title: true
  },
  {
    name: 'common.base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'common.accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.cards',
        url: '/base/cards',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.carousel',
        url: '/base/carousel',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.collapse',
        url: '/base/collapse',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.listGroup',
        url: '/base/list-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.navsTabs',
        url: '/base/navs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.pagination',
        url: '/base/pagination',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.placeholder',
        url: '/base/placeholder',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.popovers',
        url: '/base/popovers',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.progress',
        url: '/base/progress',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.spinners',
        url: '/base/spinners',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.tables',
        url: '/base/tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.tabs',
        url: '/base/tabs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.tooltips',
        url: '/base/tooltips',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'common.buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'common.buttons',
        url: '/buttons/buttons',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.buttonGroups',
        url: '/buttons/button-groups',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.dropdowns',
        url: '/buttons/dropdowns',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'common.forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'common.formControl',
        url: '/forms/form-control',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.select',
        url: '/forms/select',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.checksRadios',
        url: '/forms/checks-radios',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.range',
        url: '/forms/range',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.inputGroup',
        url: '/forms/input-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.floatingLabels',
        url: '/forms/floating-labels',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.layout',
        url: '/forms/layout',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.validation',
        url: '/forms/validation',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'common.charts',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/charts'
  },
  {
    name: 'common.icons',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      {
        name: 'common.coreuiFree',
        url: '/icons/coreui-icons',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'common.coreuiFlags',
        url: '/icons/flags',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.coreuiBrands',
        url: '/icons/brands',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'common.notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'common.alerts',
        url: '/notifications/alerts',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.badges',
        url: '/notifications/badges',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.modal',
        url: '/notifications/modal',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.toast',
        url: '/notifications/toasts',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'common.widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'common.extras'
  },
  {
    name: 'common.pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'auth.login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'auth.register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.error404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'common.error500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'common.links',
    class: 'mt-auto'
  },
  {
    name: 'common.docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
