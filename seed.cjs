const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Lista completa de socias transcrita de tus imágenes
const socias = [
  { nombre: "LUZ PERALTA", acciones: 10 },
  { nombre: "GLORIA QUISPE", acciones: 5 },
  { nombre: "NICOLE CAMPOS", acciones: 3 },
  { nombre: "CARLA DELACRUZ", acciones: 20 },
  { nombre: "VICTORIA CUBILLAS", acciones: 3 },
  { nombre: "MARIA OCHARAN", acciones: 2 },
  { nombre: "MILAGROS QUISPE", acciones: 5 },
  { nombre: "VERSA DELACRUZ", acciones: 2 },
  { nombre: "ANTUANE CAMPOS", acciones: 5 },
  { nombre: "PILAR CALAGUA", acciones: 5 },
  { nombre: "SHANTAL GAMERO", acciones: 3 },
  { nombre: "ANA FRANCIA", acciones: 4 },
  { nombre: "ROSA PINEDA", acciones: 1 },
  { nombre: "EMPERATRIZ PINEDA", acciones: 2 },
  { nombre: "FLOR ESPINOZA", acciones: 4 },
  { nombre: "ROSA ESPINOZA", acciones: 2 },
  { nombre: "ROSARIO HIDALGO", acciones: 2 },
  { nombre: "CARMEN CALAGUA", acciones: 2 },
  { nombre: "MARIA CALAGUA", acciones: 4 },
  { nombre: "CRISTHIAN CONTRERAS", acciones: 3 },
  { nombre: "MARICIELO CONTRERAS", acciones: 10 },
  { nombre: "LEYLA RAFFO", acciones: 2 },
  { nombre: "JACKELINE CHUMPITAZ", acciones: 5 },
  { nombre: "MARITZA CORDOVA", acciones: 4 },
  { nombre: "LUISA CALDERON", acciones: 13 },
  { nombre: "ISELA FRANCIA", acciones: 25 },
  { nombre: "ANGIE GUTIERREZ", acciones: 2 },
  { nombre: "ROSARIO CONILLA", acciones: 5 },
  { nombre: "MARGARITA ZAVALA", acciones: 1 },
  { nombre: "MARIBEL AYQUIPA", acciones: 3 },
  { nombre: "MARIA MEZA", acciones: 5 },
  { nombre: "DANA FLORES", acciones: 2 },
  { nombre: "MIRIAM ARIAS", acciones: 5 },
  { nombre: "RAFAELA RAMOS", acciones: 3 },
  { nombre: "ARAKENI ARTEAGA", acciones: 4 },
  { nombre: "CARMEN ARIAS", acciones: 5 },
  { nombre: "YOVANA CHUMPITAZ", acciones: 3 },
  { nombre: "BRESCIA BENAVENTE", acciones: 2 },
  { nombre: "DARLESKA PADILLA", acciones: 5 },
  { nombre: "YANINA MANCO", acciones: 10 },
  { nombre: "ALMENDRA PAJUELO", acciones: 2 },
  { nombre: "ROBERTA JAYO", acciones: 10 },
];

// Usuarios especiales que también necesitan ser creados
const usuariosEspeciales = [
    { nombre: "Administrador", email: "admin@bancowarmi.com", rol: "admin", acciones: 0 },
    { nombre: "INVITADO", email: "invitado@bancowarmi.com", rol: "socio", acciones: 2 }
];

const formatEmail = (nombreCompleto) => {
    // Normaliza el texto: todo a minúsculas, sin tildes, y toma primer nombre y último apellido
    const normalized = nombreCompleto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const parts = normalized.split(' ');
    const primerNombre = parts[0];
    const ultimoApellido = parts[parts.length - 1];
    return `${primerNombre}.${ultimoApellido}@bancowarmi.com`;
};

async function crearUsuarios() {
  console.log('Iniciando la creación de usuarios CONECTADOS...');
  const todosLosUsuarios = [
      ...socias.map(s => ({ ...s, nombre: s.nombre.trim(), email: formatEmail(s.nombre), rol: 'socio' })),
      ...usuariosEspeciales
  ];

  for (const data of todosLosUsuarios) {
    const password = '123456';

    try {
      // 1. Crear usuario en Firebase Authentication
      const userRecord = await auth.createUser({
        email: data.email,
        password: password,
        displayName: data.nombre,
      });

      console.log(`Usuario de Auth creado: ${userRecord.email} con UID: ${userRecord.uid}`);

      // 2. CREAR DOCUMENTO EN FIRESTORE USANDO EL MISMO UID
      //    Esta es la conexión que soluciona el problema.
      await db.collection('socias').doc(userRecord.uid).set({
        nombreCompleto: data.nombre,
        acciones: data.acciones,
        pagoSemanal: (data.acciones || 0) * 10,
        email: data.email,
        rol: data.rol,
        aportesAcumuladosInicial: 0,
        multasAcumuladasInicial: 0,
      });

      console.log(`Datos en Firestore creados para: ${data.nombre}`);
    } catch (error) {
      // Si el usuario ya existe, lo omite para poder correr el script varias veces si es necesario
      if (error.code === 'auth/email-already-exists') {
        console.log(`El usuario ${data.email} ya existe, omitiendo.`);
      } else {
        console.error(`Error creando a ${data.nombre}:`, error.message);
      }
    }
  }
  console.log('¡Proceso completado!');
}

// Llama a la función para ejecutar el script
crearUsuarios();