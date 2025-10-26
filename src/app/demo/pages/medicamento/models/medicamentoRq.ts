export class MedicamentoRq {
    nombre!: string;               // Nombre del medicamento
    descripcion?: string;          // Descripción (opcional)
    presentacion!: string;         // Ejemplo: Tableta 850 mg
    cantidad!: number;             // Cantidad disponible
    fechaVencimiento!: string;     // Fecha de vencimiento (YYYY-MM-DD)
  }
  