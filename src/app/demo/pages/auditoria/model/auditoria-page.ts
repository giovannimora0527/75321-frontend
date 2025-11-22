import { AuditoriaRs } from "./auditoriaRs";

export class AuditoriaPage {
    content: AuditoriaRs[] = [];

  /** Total de registros en BD */
  totalElements: number = 0;

  /** Total de páginas */
  totalPages: number = 0;

  /** Tamaño de página (registros por página) */
  size: number = 0;

  /** Número de página actual (0-based, igual que Spring) */
  number: number = 0;

  constructor(init?: Partial<AuditoriaPage>) {
    Object.assign(this, init);
  }
}