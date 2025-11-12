// seed.cjs
const admin = require('firebase-admin');

// =============================================================
// INICIO DE LA MODIFICACIÓN SEGURA
// =============================================================

// 1. Requiere el paquete 'dotenv' para leer el archivo .env.local
require('dotenv').config({ path: '.env.local' });

// 2. LÍNEA INSEGURA (la borramos):
// const serviceAccount = require('./serviceAccountKey.json');

// 3. NUEVA LÍNEA SEGURA:
//    Lee la variable de entorno (que es un string) y la convierte en un objeto JSON.
const serviceAccount = JSON.parse(process.env.VITE_FIREBASE_SERVICE_ACCOUNT_JSON);

// =============================================================
// FIN DE LA MODIFICACIÓN SEGURA
// =============================================================


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const socias = [
    // ... (tu lista de socias permanece exactamente igual)
    { nombre: "LUZ PERALTA", acciones: 10, pagar: 100 },
    { nombre: "GLORIA QUISPE", acciones: 5, pagar: 50 },
    { nombre: "NICOLE CAMPOS", acciones: 3, pagar: 30 },
    { nombre: "CARLA DELACRUZ", acciones: 20, pagar: 200 },
    { nombre: "VICTORIA CUBILLAS", acciones: 3, pagar: 30 },
    { nombre: "MARIA OCHARAN", acciones: 2, pagar: 20 },
    { nombre: "MILAGROS QUISPE", acciones: 5, pagar: 50 },
    { nombre: "VERSA DELACRUZ", acciones: 2, pagar: 20 },
    { nombre: "ANTUANE CAMPOS", acciones: 5, pagar: 50 },
    { nombre: "PILAR CALAGUA", acciones: 5, pagar: 50 },
    { nombre: "SHANTAL GAMERO", acciones: 3, pagar: 30 },
    { nombre: "ANA FRANCIA", acciones: 4, pagar: 40 },
    { nombre: "ROSA PINEDA", acciones: 1, pagar: 10 },
    { nombre: "EMPERATRIZ PINEDA", acciones: 2, pagar: 20 },
    { nombre: "FLOR ESPINOZA", acciones: 4, pagar: 40 },
    { nombre: "ROSA ESPINOZA", acciones: 2, pagar: 20 },
    { nombre: "ROSARIO HIDALGO", acciones: 2, pagar: 20 },
    { nombre: "CARMEN CALAGUA", acciones: 2, pagar: 20 },
    { nombre: "MARIA CALAGUA", acciones: 4, pagar: 40 },
    { nombre: "CRISTHIAN CONTRERAS", acciones: 3, pagar: 30 },
    { nombre: "MARICIELO CONTRERAS", acciones: 10, pagar: 100 },
    { nombre: "LEYLA RAFFO", acciones: 2, pagar: 20 },
    { nombre: "JACKELINE CHUMPITAZ", acciones: 5, pagar: 50 },
    { nombre: "MARITZA CORDOVA", acciones: 4, pagar: 40 },
    { nombre: "LUISA CALDERON", acciones: 13, pagar: 130 },
    { nombre: "ISELA FRANCIA", acciones: 25, pagar: 250 },
    { nombre: "ANGIE GUTIERREZ", acciones: 2, pagar: 20 },
    { nombre: "ROSARIO CONILLA", acciones: 5, pagar: 50 },
    { nombre: "MARGARITA ZAVALA", acciones: 1, pagar: 10 },
    { nombre: "MARIBEL AYQUIPA", acciones: 3, pagar: 30 },
    { nombre: "MARIA MEZA", acciones: 5, pagar: 50 },
    { nombre: "DANA FLORES", acciones: 2, pagar: 20 },
    { nombre: "MIRIAM ARIAS", acciones: 5, pagar: 50 },
    { nombre: "RAFAELA RAMOS", acciones: 3, pagar: 30 },
    { nombre: "ARAKENI ARTEAGA", acciones: 4, pagar: 40 },
    { nombre: "CARMEN ARIAS", acciones: 5, pagar: 50 },
    { nombre: "YOVANA CHUMPITAZ", acciones: 3, pagar: 30 },
    { nombre: "BRESCIA BENAVENTE", acciones: 2, pagar: 20 },
    { nombre: "DARLESKA PADILLA", acciones: 5, pagar: 50 },
    { nombre: "YANINA MANCO", acciones: 10, pagar: 100 },
    { nombre: "ALMENDRA PAJUELO", acciones: 2, pagar: 20 },
    { nombre: "ROBERTA JAYO", acciones: 10, pagar: 100 }
];

const formatEmail = (nombreCompleto) => {
    const normalized = nombreCompleto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const parts = normalized.split(' ');
    
    const primerNombre = parts[0];
    const primerApellido = parts.find(p => p !== 'de' && p !== 'la' && p !== 'del' && p !== primerNombre);

    return `${primerNombre}.${primerApellido}@bancowarmi.com`;
};

async function crearUsuarios() {
  console.log('Iniciando la creación de usuarios con el nuevo formato...');
  for (const socia of socias) {
    const email = formatEmail(socia.nombre);
    const password = '123456';

    try {
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: socia.nombre,
      });
      console.log(`Usuario de Auth creado: ${userRecord.email}`);

      await db.collection('socias').doc(userRecord.uid).set({
        nombreCompleto: socia.nombre,
        acciones: socia.acciones,
        pagoSemanal: socia.pagar,
        email: email,
      });
      console.log(`Datos en Firestore creados para: ${socia.nombre}`);

    } catch (error) {
      console.error(`Error creando a ${socia.nombre}:`, error.message);
    }
  }
  console.log('¡Proceso completado!');
}

crearUsuarios();