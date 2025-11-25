import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

// --- FECHAS CLAVE DE LA CAMPAÑA ---
const FECHA_INICIO_APORTES = new Date('2025-07-08T00:00:00-05:00'); // -05:00 para zona horaria de Perú

// Tu patrón de fondo personalizado se mantiene
const cardPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8 L15 13 L9 13 Z' fill='%23FFF' fill-opacity='0.08'/%3E%3C/svg%3E")`;

interface BalanceCardProps {
  user: User;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ user }) => {
  const [totalAportes, setTotalAportes] = useState<number | null>(null);
  const [totalMultas, setTotalMultas] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaldos = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // --- 1. Obtener Datos Iniciales y calcular pagoSemanal de la Socia ---
        const sociaDocRef = doc(db, 'socias', user.uid);
        const sociaDoc = await getDoc(sociaDocRef);
        
        if (!sociaDoc.exists()) throw new Error("Documento de socia no encontrado.");
        
        const dataSocia = sociaDoc.data();
        const aportesInicial = dataSocia.aportesAcumuladosInicial || 0;
        const multasInicial = dataSocia.multasAcumuladasInicial || 0;
        
        // ===== ¡LA CORRECCIÓN LÓGICA ESTÁ AQUÍ! =====
        // Calculamos el pago semanal SIEMPRE basándonos en las acciones.
        const pagoSemanal = (dataSocia.acciones || 0) * 10;

        // --- 2. Calcular Aportes Nuevos (de forma más eficiente) ---
        // Traemos todas las reuniones relevantes de una sola vez
        const reunionesRef = collection(db, 'reuniones');
        const reunionesQuery = query(reunionesRef, where('fecha', '>=', Timestamp.fromDate(FECHA_INICIO_APORTES)));
        const reunionesSnapshot = await getDocs(reunionesQuery);

        let aportesNuevosCount = 0;
        // Ahora, contamos los aportes en el lado del cliente (en la app)
        reunionesSnapshot.forEach(doc => {
          if (doc.data().aportes?.[user.uid] === 'aporto') {
            aportesNuevosCount++;
          }
        });
        const aportesNuevos = aportesNuevosCount * pagoSemanal;
        
        // --- 3. Calcular Multas Nuevas (sin cambios) ---
        const multasRef = collection(db, 'multas');
        const multasQuery = query(multasRef, 
          where('sociaId', '==', user.uid), 
          where('estado', '==', 'pendiente')
        );
        const multasSnapshot = await getDocs(multasQuery);
        let multasNuevas = 0;
        multasSnapshot.forEach(doc => {
          multasNuevas += doc.data().monto;
        });

        // --- 4. Sumar Valores y Actualizar Estados (sin cambios) ---
        setTotalAportes(aportesInicial + aportesNuevos);
        setTotalMultas(multasInicial + multasNuevas);

      } catch (error) {
        console.error("Error al calcular saldos:", error);
        setTotalAportes(0);
        setTotalMultas(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaldos();
  }, [user]);

  // Tu función de fecha dinámica se mantiene intacta
  const getLatestMeetingDate = (): string => {
    const now = new Date();
    const lastMeetingDate = new Date(now);
    const dayOfWeek = now.getDay();
    const hour = now.getHours();
    const daysToSubtract = (dayOfWeek - 2 + 7) % 7;
    lastMeetingDate.setDate(now.getDate() - daysToSubtract);
    if (dayOfWeek === 2 && hour < 17) {
      lastMeetingDate.setDate(lastMeetingDate.getDate() - 7);
    }
    const formattedDate = lastMeetingDate.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
    return `hasta ${formattedDate}`;
  };

  

  return (
    <div 
      className="bg-brand-purple rounded-2xl p-5 mx-4 text-white shadow-lg relative overflow-hidden mt-4"
      style={{ 
        backgroundImage: cardPattern,
        backgroundSize: '24px 24px',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-90">Mis Aportes Acumulados</p>
        
        <p className="text-4xl font-extrabold mt-2 tracking-tight">
          {isLoading ? (
            <span className="animate-pulse bg-white/30 rounded-md px-12 py-2">S/ ...</span>
          ) : (
            `S/ ${(totalAportes ?? 0).toFixed(2)}`
          )}
        </p>
        
        <div className="mt-3 pt-3 border-t border-white/20 text-xs">
          <div className="flex justify-between items-center">
            <span className="opacity-80">(-) Total Multas Pendientes:</span>
            <span className="font-semibold">
              {isLoading ? `...` : `S/ ${(totalMultas ?? 0).toFixed(2)}`}
            </span>
          </div>
           {/* ===== ¡CAMBIO #2: SALDO NETO OCULTO! ===== */}
          {/*
            <div className="flex justify-between items-center text-sm mt-2 font-bold">
              <span>Saldo Neto:</span>
              <span className="text-lg">
                {isLoading ? `...` : `S/ ${saldoNeto.toFixed(2)}`}
              </span>
            </div>
          */}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs opacity-80">{getLatestMeetingDate()}</p>
          <button className="bg-brand-pink text-white text-xs font-bold py-2.5 px-5 rounded-full transition-transform duration-150 transform hover:scale-105 active:scale-95">
            Mi Reporte {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;