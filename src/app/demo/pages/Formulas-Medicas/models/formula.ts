export class Formula {
  id!: number;
  cita!: {
    id: number;
  };
  medicamento!: {
    id: number;
    nombre?: string;
  };
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: Date;
  
  
}
