// functions/src/index.ts

// 1. Importaciones corregidas para la nueva versión de la librería
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Inicializa la app de administrador
initializeApp();
const db = getFirestore();

// Definimos los montos de las multas
const montosMultas = {
  tardanza: 3,
  falta: 5,
  no_aporto: 5,
};

// ===================================================================
// FUNCIÓN #1: "El Asistente Inteligente" (Genera multas)
// ===================================================================
// Se dispara cada vez que se crea o actualiza un documento en 'reuniones'.
export const generarMultasAutomaticas = onDocumentWritten("reuniones/{reunionId}", async (event) => {
  const data = event.data?.after.data();
  if (!data) {
    logger.info("No hay datos en el documento, saliendo.");
    return;
  }

  const asistencias = data.asistencias as Record<string, string>;
  const reunionId = event.params.reunionId;
  logger.info(`Procesando reunión: ${reunionId}`);

  const batch = db.batch();

  for (const [sociaId, estado] of Object.entries(asistencias)) {
    if (estado === "tardanza" || estado === "falta" || estado === "no_aporto") {
      const monto = montosMultas[estado as keyof typeof montosMultas];
      const descripcion = `Multa por ${estado.replace("_", " ")} en la reunión del ${reunionId}.`;
      
      const multaRef = db.collection("multas").doc(); // ID automático
      
      batch.set(multaRef, {
        sociaId,
        reunionId,
        monto,
        fecha: new Date(), // Usa la fecha actual de la ejecución de la función
        tipo: estado,
        descripcion,
        estado: "pendiente",
      });
      logger.info(`Multa de S/${monto} preparada para ${sociaId} por ${estado}.`);
    }
  }
  
  await batch.commit();
  logger.info("Proceso de multas completado.");
});


// ===================================================================
// FUNCIÓN #2: "El Reloj Despertador" (Crea la reunión cada martes)
// ===================================================================
// Se ejecuta todos los martes a las 5:00 PM (17:00) hora de Lima, Perú.
export const crearRegistroDeReunion = onSchedule({
  schedule: "every tuesday 17:00",
  timeZone: "America/Lima", // ¡IMPORTANTE! Zona horaria para Perú
}, async () => {
  const hoy = new Date();
  const reunionId = hoy.toISOString().split("T")[0]; // Formato YYYY-MM-DD

  try {
    const reunionRef = db.collection("reuniones").doc(reunionId);
    await reunionRef.set({
      fecha: hoy,
      estado: "abierta",
      asistencias: {},
      aportes: {},
    }, { merge: true }); // 'merge: true' evita sobreescribir si ya existe
    logger.info(`Documento de reunión creado/actualizado para: ${reunionId}`);
  } catch (error) {
    logger.error("Error al crear el documento de reunión:", error);
  }
});