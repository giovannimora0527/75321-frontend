import { Usuario } from '../../usuario/model/usuario';

export class Paciente {
    id!: number;
    numDoc!: number;
    fechaNacimiento!: Date;
    Dir!: string;
    usuario!: number;
    TipDoc!: string;
    Tel!: number;
    Ape!: string;
    Gen!: string;
    Nom!: string;
}