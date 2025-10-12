export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usuario',
        title: 'Gestión de Usuarios',
        type: 'item',
        url: '/inicio/usuario',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'medicamentos',
        title: 'Medicamentos',
        type: 'item',
        url: '/medicamentos',
        icon: 'feather icon-box',
        classes: 'nav-item'
      },
      {
        id: 'citas',
        title: 'Citas',
        type: 'item',
        url: '/citas',
        icon: 'feather icon-calendar',
        classes: 'nav-item'
      },
      {
        id: 'formula-medica',
        title: 'Fórmulas ',
        type: 'item',
        url: '/formula-medica',
        icon: 'feather icon-file-text',
        classes: 'nav-item'
      },
      {
        id: 'historia-medica',
        title: 'Historia Médica',
        type: 'item',
        url: '/historia-medica',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
      {
        id: 'gestion-especializacion',
        title: 'Especializaciones',
        type: 'item',
        url: '/gestion-especializacion',
        icon: 'feather icon-layers',
        classes: 'nav-item'
      }
    ]
  }
];
