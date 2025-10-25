export class MedicamentoRs {
    id!: number;                   // ID del medicamento (autogenerado)
    nombre!: string;               // Nombre del medicamento
    descripcion!: string;          // Descripción del medicamento
    presentacion!: string;         // Presentación (ejemplo: Tableta 850 mg)
    cantidad!: number;             // Cantidad disponible
    fechaVencimiento!: string;     // Fecha de vencimiento (YYYY-MM-DD)
  }
  