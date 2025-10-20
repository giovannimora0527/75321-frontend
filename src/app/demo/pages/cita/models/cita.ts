import { Medico } from './../../medico/models/medico';
import { Paciente } from './../../paciente/models/paciente';
export class Cita {
  id!: number;
  paciente_id!: Paciente;
  Medico_id!: Medico;
  fecha_hora!: Date;
  estado!: string;
  motivo!: string;
}
