<<<<<<< HEAD
export class Paciente {
  id!: number;
  usuarioId!: number;        
  tipoDocumento!: string;    
  numeroDocumento!: string;  
  nombres!: string;          
  apellidos!: string;        
  fechaNacimiento!: Date;
  genero!: string;           
  telefono!: string;         
  direccion!: string;        
}
=======
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


>>>>>>> 455a489f5cccbe86e1b9a3e75ebc63d4019dac10
