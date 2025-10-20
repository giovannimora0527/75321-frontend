export interface Usuario {
  id?: number;
  username: string;
  password: string;
  rol: string;
  numeroDocumento: string;
  activo: boolean;
  fechaCreacion?: string;
}
