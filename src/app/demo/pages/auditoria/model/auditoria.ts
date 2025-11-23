export interface Auditoria {
    id: number;
    fechaHora: string;
    nombreUsuario: string;
    descripcionError: string;
    direccionIp: string | null;
    bloqueado: boolean;
}
