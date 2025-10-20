export interface Paciente {
  id?: number;
  usuarioID?: number;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string; // YYYY-MM-DD
  genero?: string;
  telefono?: string;
  direccion?: string;
}


