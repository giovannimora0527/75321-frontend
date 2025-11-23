export interface LoginRs {
  // Campos básicos de respuesta
  status: number;
  mensaje?: string;
  error?: string;
  
  // Datos del usuario
  usuario?: string;
  rol?: string;
  id?: number;
  token?: string;
  
  // NUEVO - Campos de auditoría y bloqueo
  blocked?: boolean;
  minutosRestantes?: number;
  intentosRestantes?: number;
  
  // NUEVO - Campos de contraseña temporal
  requiereCambioPassword?: boolean;
  usandoPasswordTemporal?: boolean;
}
