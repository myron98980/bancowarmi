import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, writeBatch, getDocs, query, where, Timestamp } from 'firebase/firestore'; 

import { type Socia, type AsistenciaEstado, type AporteEstado, type ReunionData } from '../types';

// --- FECHAS CLAVE DE LA CAMPAÑA ---
const FECHA_INICIO_APORTES = new Date('2025-07-08T00:00:00-05:00'); // -05:00 para zona horaria de Perú

const AdminPanel: React.FC = () => {
  const [socias, setSocias] = useState<Socia[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [asistencias, setAsistencias] = useState<Record<string, AsistenciaEstado>>({});
  const [aportes, setAportes] = useState<Record<string, AporteEstado>>({});
  const [deudasAportes, setDeudasAportes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [saldosIniciales, setSaldosIniciales] = useState<Record<string, { aportes: number; multas: number }>>({});
  const [isSavingSaldos, setIsSavingSaldos] = useState(false);
  const [saldosMessage, setSaldosMessage] = useState('');

  const formatDateToId = (date: Date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset).toISOString().split('T')[0];
  };

  useEffect(() => {
    // Listener para las socias
    const unsubSocias = onSnapshot(collection(db, "socias"), (snapshot) => {
      const sociasList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Socia[];
      const sociosOnly = sociasList.filter(s => s.rol === 'socio');
      sociosOnly.sort((a, b) => (a.nombreCompleto || '').localeCompare(b.nombreCompleto || ''));
      setSocias(sociosOnly);

      const saldos: Record<string, { aportes: number; multas: number }> = {};
      sociosOnly.forEach(socia => {
        saldos[socia.id] = {
          aportes: socia.aportesAcumuladosInicial || 0,
          multas: socia.multasAcumuladasInicial || 0,
        };
      });
      setSaldosIniciales(saldos);
    });
    return () => unsubSocias();
  }, []);

  useEffect(() => {
    if (socias.length === 0) return;
    
    const loadData = async () => {
      setIsLoading(true);
      setMessage('');

  // ===== ¡LÓGICA ACTUALIZADA AQUÍ! =====
      
      // 1. Obtenemos TODOS los documentos de reuniones relevantes de una sola vez.
      //    Esta consulta es simple y no requiere índices compuestos.
      const reunionesRef = collection(db, 'reuniones');
      const reunionesQuery = query(reunionesRef, where('fecha', '<', Timestamp.fromDate(selectedDate)));
      const reunionesSnapshot = await getDocs(reunionesQuery);
      const reunionesData = reunionesSnapshot.docs.map(doc => doc.data());
      
      // 2. Ahora, procesamos los datos en el frontend.
      const deudasCalculadas: Record<string, number> = {};
      socias.forEach(socia => {
        const pagoSemanal = (socia.acciones || 0) * 10;
        let martesTranscurridos = 0;
        let fechaActual = new Date(FECHA_INICIO_APORTES);
        const hastaFecha = new Date(selectedDate);
        hastaFecha.setHours(0, 0, 0, 0);

        while (fechaActual < hastaFecha) {
          if (fechaActual.getDay() === 2) martesTranscurridos++;
          fechaActual.setDate(fechaActual.getDate() + 1);
        }
        const aporteEsperado = martesTranscurridos * pagoSemanal;
        
        // Contamos los aportes reales recorriendo los datos que ya descargamos
        let aportesRealesCount = 0;
        reunionesData.forEach(reunion => {
          if (reunion.aportes && reunion.aportes[socia.id] === 'aporto') {
            aportesRealesCount++;
          }
        });
        const aporteReal = (aportesRealesCount * pagoSemanal) + (socia.aportesAcumuladosInicial || 0);
        
        deudasCalculadas[socia.id] = Math.max(0, aporteEsperado - aporteReal);
      });
      setDeudasAportes(deudasCalculadas);

      // --- CARGA DE DATOS DE LA REUNIÓN ---
      try {
        const reunionId = formatDateToId(selectedDate);
        const reunionDocRef = doc(db, 'reuniones', reunionId);
        const reunionDoc = await getDoc(reunionDocRef);
        if (reunionDoc.exists()) {
          const data = reunionDoc.data() as ReunionData;
          setAsistencias(data.asistencias || {});
          setAportes(data.aportes || {});
          setMessage("Registros cargados de una reunión anterior.");
        } else {
          setAsistencias({});
          setAportes({});
          setMessage("No hay registros para esta fecha. Puedes crear uno nuevo.");
        }
      } catch (error) {
        console.error("Error al cargar datos de la reunión:", error);
        setMessage("Error al cargar los datos de la reunión.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedDate, socias]);

  // --- El resto de tus funciones ---
  const handleSaldoChange = (sociaId: string, tipo: 'aportes' | 'multas', valor: string) => {
    const numero = valor === '' ? 0 : parseInt(valor, 10);
    if (!isNaN(numero)) {
      setSaldosIniciales(prev => ({ ...prev, [sociaId]: { ...(prev[sociaId] || { aportes: 0, multas: 0 }), [tipo]: numero } }));
    }
  };

  const handleGuardarSaldos = async () => {
    setIsSavingSaldos(true);
    setSaldosMessage('');
    const batch = writeBatch(db);
    socias.forEach(socia => {
      const sociaDocRef = doc(db, 'socias', socia.id);
      batch.update(sociaDocRef, {
        aportesAcumuladosInicial: saldosIniciales[socia.id]?.aportes || 0,
        multasAcumuladasInicial: saldosIniciales[socia.id]?.multas || 0,
      });
    });
    try {
      await batch.commit();
      setSaldosMessage('¡Saldos iniciales guardados con éxito!');
    } catch (error) {
      console.error("Error al guardar saldos:", error);
      setSaldosMessage('Hubo un error al guardar los saldos.');
    } finally {
      setIsSavingSaldos(false);
    }
  };

  const handleAsistenciaChange = (sociaId: string, estado: AsistenciaEstado) => {
    setAsistencias(prev => ({ ...prev, [sociaId]: estado }));
  };

  const handleAporteChange = (sociaId: string, estado: AporteEstado) => {
    setAportes(prev => ({ ...prev, [sociaId]: estado }));
  };
  
  const handleGuardar = async () => {
    setIsSaving(true);
    setMessage('');
    const reunionId = formatDateToId(selectedDate);
    try {
      await setDoc(doc(db, 'reuniones', reunionId), { fecha: selectedDate, asistencias, aportes }, { merge: true });
      setMessage('¡Registros guardados con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) { 
      console.error("Error al guardar:", error);
      setMessage("Error al guardar los registros.");
    } 
    finally { setIsSaving(false); }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <button onClick={() => signOut(auth)} className="text-sm bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600">Cerrar Sesión</button>
      </header>
      
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0">Registro de Reunión</h2>
          <input 
            type="date"
            value={formatDateToId(selectedDate)}
            onChange={(e) => setSelectedDate(new Date(e.target.value.replace(/-/g, '/')))}
            className="border-gray-300 rounded-lg shadow-sm p-2 text-sm"
          />
        </div>
        <div className="hidden md:grid grid-cols-3 gap-4 px-4 py-2 text-left text-sm font-semibold text-gray-500 border-b">
          <span>Socia</span>
          <span className="text-center">Asistencia</span>
          <span className="text-center">Aporte Semanal</span>
        </div>
        <div className="space-y-3 mt-2">
          {isLoading ? <p className="text-center p-4 text-gray-500">Cargando...</p> : socias.map((socia) => {
            const asistenciaMarcada = !!asistencias[socia.id];
            const aporteMarcado = !!aportes[socia.id];
            const filaCompleta = asistenciaMarcada && aporteMarcado;
            const pagoDeHoy = (socia.acciones || 0) * 10;
            const deuda = deudasAportes[socia.id] || 0;
            const totalAPagarHoy = pagoDeHoy + deuda;

            return (
              <div key={socia.id} className={`p-4 rounded-lg grid md:grid-cols-3 gap-4 items-center transition-colors duration-300 ${filaCompleta ? 'bg-green-50' : 'bg-gray-50'}`}>
                <span className="font-medium text-gray-800">{socia.nombreCompleto}</span>
                <div className="flex justify-center space-x-2">
                  {(['asistio', 'tardanza', 'falta'] as const).map(estado => {
                    const isSelected = asistencias[socia.id] === estado;
                    return (
                      <button key={estado} onClick={() => handleAsistenciaChange(socia.id, estado)} 
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${isSelected ? 'text-white scale-105 shadow-md' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} ${estado === 'asistio' && isSelected ? 'bg-green-500' : ''} ${estado === 'tardanza' && isSelected ? 'bg-yellow-500' : ''} ${estado === 'falta' && isSelected ? 'bg-red-500' : ''}`}>
                        {estado.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center items-center space-x-2">
                  <span className={`text-sm font-semibold w-20 text-right ${deuda > 0 ? 'text-red-500' : 'text-gray-600'}`}>
                    S/ {totalAPagarHoy.toFixed(2)}
                  </span>
                  {(['aporto', 'no_aporto'] as const).map(estado => {
                    const isSelected = aportes[socia.id] === estado;
                    return (
                      <button key={estado} onClick={() => handleAporteChange(socia.id, estado)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${isSelected ? 'text-white scale-105 shadow-md' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} ${estado === 'aporto' && isSelected ? 'bg-blue-500' : ''} ${estado === 'no_aporto' && isSelected ? 'bg-orange-500' : ''}`}>
                        {estado === 'aporto' ? 'APORTÓ' : 'NO APORTÓ'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <button onClick={handleGuardar} disabled={isSaving || isLoading} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
            {isSaving ? 'Guardando...' : 'Guardar Registros'}
          </button>
          {message && <p className={`mt-4 text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-gray-600'}`}>{message}</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mt-8">
        <h2 className="text-xl font-bold mb-4">Configurar Saldos Iniciales</h2>
        <p className="text-sm text-gray-500 mb-4">
          Usa esta herramienta para cargar los montos acumulados de cada socia antes de empezar a usar la app.
        </p>
        <div className="space-y-3">
          {isLoading ? <p className="text-center p-4 text-gray-500">Cargando socias...</p> : socias.map(socia => (
            <div key={socia.id} className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <span className="font-medium text-gray-800">{socia.nombreCompleto}</span>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Aportes S/</label>
                <input
                  type="number"
                  placeholder='0'
                  value={saldosIniciales[socia.id]?.aportes || ''}
                  onChange={(e) => handleSaldoChange(socia.id, 'aportes', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Multas S/</label>
                <input
                  type="number"
                  placeholder='0'
                  value={saldosIniciales[socia.id]?.multas || ''}
                  onChange={(e) => handleSaldoChange(socia.id, 'multas', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button onClick={handleGuardarSaldos} disabled={isSavingSaldos || isLoading} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">
            {isSavingSaldos ? 'Guardando...' : 'Guardar Saldos Iniciales'}
          </button>
          {saldosMessage && <p className={`mt-4 text-sm font-medium ${saldosMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{saldosMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;