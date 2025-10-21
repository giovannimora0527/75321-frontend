
export class Formula{
  id!: number;
  citaid!: number;                 // igual que JSON
  medicamentoid!: number;          // igual que JSON
  medicamentoNombre!: string;
  dosis!: string;
  indicaciones!: string;
  fechaCreacionRegistro!: string;  // o Date si luego lo parseas
}