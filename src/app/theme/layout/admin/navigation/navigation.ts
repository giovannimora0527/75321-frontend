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
    id: "navigation",
    title: "Inicio",
    type: "group",
    icon: "icon-navigation",
    children: [
      {
        id: "usuario",
        title: "Gestión de Usuarios",
        type: "item",
        url: "/inicio/usuario",
        icon: "feather icon-user",
        classes: "nav-item",
      },
      {
        id: "medico",
        title: "Gestión de Medicos",
        type: "item",
        url: "/inicio/medico",
        icon: "feather icon-user-check",
        classes: "nav-item",
      },
      {
        id: 'especializacion',
        title: 'Especializacion',
        type: 'item',
        url: '/inicio/Especializacion',
        icon: 'feather icon-user-plus',
        classes: 'nav-item'
      },
      {
        id: "paciente",
        title: "Gestión de Pacientes",
        type: "item",
        url: "/inicio/paciente",
        icon: "feather icon-users",
        classes: "nav-item",
      },
      {
        id: "medicamento",
        title: "Gestión de Medicamentos",
        type: "item",
        url: "/inicio/Medicamentos",
        icon: "feather icon-package",
        classes: "nav-item",
      },
      {
        id: "cita",
        title: "Gestión de citas",
        type: "item",
        url: "/inicio/Citas",
        icon: "feather icon-calendar",
        classes: "nav-item",
      },
      {
        id: "formula",
        title: "Formulas medicas",
        type: "item",
        url: "/inicio/Formulas-Medicas",
        icon: "feather icon-file-text",
        classes: "nav-item",
      },
    ],
  }
  /* ---------- Nuevos menus aqui -------------  */
];
