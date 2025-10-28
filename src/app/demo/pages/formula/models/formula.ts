import { Cita } from "../../cita/models/cita";
import { Medicamento } from "../../medicamento/models/medicamento";

export class Formula {
    id!: number;
    medicamento!: Medicamento;
    cita!: Cita;
    dosis!: string;
    indicaciones!: string;
    fechaCreacionRegistro!: Date;
    fechaActualizacionRegistro!: Date;
}