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
        id: 'medico',
        title: 'Gestión de médicos',
        type: 'item',
        url: '/inicio/medico',
        icon: 'feather icon-user-plus',
        classes: 'nav-item'
      },
      //Menus
      {
        id: 'paciente',
        title: 'Gestión de pacientes',
        type: 'item',
        url: '/inicio/paciente',
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id:'medicamentos',
        title: 'Gestión de medicamentos',
        type: 'item',
        url: '/inicio/medicamentos',
        icon: 'feather icon-package',
        classes: 'nav-item'
      },
      {
        id:'citas',
        title: 'Gestión de citas',
        type: 'item',
        url: '/inicio/citas',
        icon: 'feather icon-calendar',
        classes: 'nav-item'
      },
      {
        id:'formulas-medicas',
        title: 'Gestión de fórmulas médicas',
        type: 'item',
        url: '/inicio/formulas-medicas',
        icon: 'feather icon-clipboard',
        classes: 'nav-item'
      },
      {
        id:'historias-medicas',
        title: 'Gestión de historias médicas',
        type: 'item',
        url: '/inicio/historias-medicas',
        icon: 'feather icon-file-text',
        classes: 'nav-item'
      },

       {
         id:'especializaciones',
         title: 'Gestión de especializaciones',
         type: 'item',
         url: '/inicio/especializaciones',
         icon: 'feather icon-award',
         classes: 'nav-item'
       }



    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];
