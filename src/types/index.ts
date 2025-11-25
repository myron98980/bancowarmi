// src/types/index.ts

// Define cómo se ve un objeto de Socia en nuestra app
export interface Socia {
  id: string; // El UID del usuario de Firebase
  nombreCompleto: string;
  acciones: number;
  pagoSemanal: number;
  email: string;
  rol: 'admin' | 'socio';
  aportesAcumuladosInicial?: number;
  multasAcumuladasInicial?: number;
}

// Tipos separados y claros para cada concepto
export type AsistenciaEstado = 'asistio' | 'tardanza' | 'falta';
export type AporteEstado = 'aporto' | 'no_aporto';


// Define cómo se guardará el mapa de asistencias en Firestore
export interface ReunionData {
  asistencias: Record<string, AsistenciaEstado>;
  aportes: Record<string, AporteEstado>;
}

// NUEVO: Define la estructura de un documento de multa
export interface Multa {
  id: string;
  sociaId: string;
  reunionId: string;
  monto: number;
  fecha: { seconds: number, nanoseconds: number }; // Formato de fecha de Firestore
  tipo: string;
  descripcion: string;
  estado: 'pendiente' | 'pagada';
}
// NUEVO: Define una estructura unificada para cualquier movimiento
export type Movimiento = {
  id: string;
  tipo: 'aporte' | 'multa';
  descripcion: string;
  monto: number;
  fecha: Date;
};