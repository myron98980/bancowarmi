import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { type Movimiento } from '../types';

// Íconos para cada tipo de movimiento
const UpArrowIcon = () => ( <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg> );
const DownArrowIcon = () => ( <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg> );

interface RecentMovementsProps {
  user: User;
}

const RecentMovements: React.FC<RecentMovementsProps> = ({ user }) => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovimientos = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        // --- Obtener Aportes Recientes ---
        const reunionesRef = collection(db, 'reuniones');
        const reunionesQuery = query(reunionesRef, orderBy('fecha', 'desc'), where(`aportes.${user.uid}`, '==', 'aporto'));
        const reunionesSnapshot = await getDocs(reunionesQuery);
        
        const aportesPromise = getDoc(doc(db, 'socias', user.uid)).then(sociaDoc => {
          const pagoSemanal = sociaDoc.exists() ? (sociaDoc.data().acciones || 0) * 10 : 0;
          return reunionesSnapshot.docs.map(doc => ({
            id: `aporte-${doc.id}`,
            tipo: 'aporte' as const,
            descripcion: 'Aporte Semanal',
            monto: pagoSemanal,
            fecha: (doc.data().fecha as Timestamp).toDate(),
          }));
        });
        
        // --- Obtener Multas Recientes ---
        const multasRef = collection(db, 'multas');
        const multasQuery = query(multasRef, where('sociaId', '==', user.uid), orderBy('fecha', 'desc'));
        const multasSnapshot = await getDocs(multasQuery);
        
        const multas = multasSnapshot.docs.map(doc => ({
          id: `multa-${doc.id}`,
          tipo: 'multa' as const,
          descripcion: doc.data().descripcion,
          monto: doc.data().monto,
          fecha: (doc.data().fecha as Timestamp).toDate(),
        }));

        const aportes = await aportesPromise;

        // --- Combinar y Ordenar ---
        const todosLosMovimientos = [...aportes, ...multas];
        todosLosMovimientos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        setMovimientos(todosLosMovimientos.slice(0, 4));

      } catch (error) {
        console.error("Error al cargar movimientos recientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovimientos();
  }, [user]);

  // ===== ¡EL CÓDIGO FALTANTE ESTÁ AQUÍ! =====
  return (
    <div className="px-4 my-6">
       <h2 className="font-bold text-gray-800 text-lg mb-4">Movimientos Recientes</h2>
       
       {isLoading ? (
         <div className="text-center text-gray-500 p-4">Cargando movimientos...</div>
       ) : movimientos.length === 0 ? (
         <div className="bg-white p-4 rounded-lg shadow-sm text-center text-gray-500">Aún no hay movimientos para mostrar.</div>
       ) : (
         <div className="space-y-3">
           {movimientos.map((mov) => (
             <div key={mov.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
               <div className="flex items-center">
                 <div className={`rounded-full p-2 mr-4 ${mov.tipo === 'aporte' ? 'bg-green-100' : 'bg-red-100'}`}>
                   {mov.tipo === 'aporte' ? <UpArrowIcon /> : <DownArrowIcon />}
                 </div>
                 <div>
                   <p className="font-medium">{mov.descripcion}</p>
                   <p className="text-sm text-gray-500">{mov.fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                 </div>
               </div>
               <p className={`font-semibold ${mov.tipo === 'aporte' ? 'text-green-600' : 'text-red-600'}`}>
                 {mov.tipo === 'aporte' ? '+' : '-'}S/{mov.monto.toFixed(2)}
               </p>
             </div>
           ))}
         </div>
       )}
    </div>
  );
};

export default RecentMovements;