// src/components/MultasScreen.tsx
import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
// 1. Importamos 'Timestamp' para manejar las fechas de Firestore
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore'; 
import { db } from '../firebase';
import { type Multa } from '../types';

interface MultasScreenProps {
  user: User;
  onBack: () => void; // Aunque no lo usemos visualmente, lo dejamos por consistencia
}

const MultasScreen: React.FC<MultasScreenProps> = ({ user }) => { // onBack se recibe pero no se usa aquí
  const [multas, setMultas] = useState<Multa[]>([]);
  const [totalMultas, setTotalMultas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMultas = async () => {
      setIsLoading(true);
      const multasRef = collection(db, 'multas');
      const q = query(
        multasRef,
        where('sociaId', '==', user.uid),
        where('estado', '==', 'pendiente'),
        orderBy('fecha', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const multasList: Multa[] = [];
      let total = 0;
      
      querySnapshot.forEach(doc => {
        const data = doc.data() as Multa;
        multasList.push({ ...data, id: doc.id });
        total += data.monto;
      });
      
      setMultas(multasList);
      setTotalMultas(total);
      setIsLoading(false);
    };

    fetchMultas();
  }, [user.uid]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Mis Multas Pendientes</h2>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
        <strong className="font-bold">Total a Pagar: </strong>
        <span className="block sm:inline">S/ {totalMultas.toFixed(2)}</span>
      </div>
      
      {isLoading ? (
        <p>Cargando multas...</p>
      ) : multas.length === 0 ? (
        <p>¡Felicidades! No tienes multas pendientes.</p>
      ) : (
        <ul className="space-y-3">
          {multas.map(multa => {
            // 2. Convertimos el objeto Timestamp a una fecha de JavaScript
            const fecha = (multa.fecha as unknown as Timestamp).toDate();
            
            return (
              <li key={multa.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{multa.descripcion}</span>
                  <span className="font-bold text-red-600">S/ {multa.monto.toFixed(2)}</span>
                </div>
                {/* 3. Usamos la fecha convertida */}
                <p className="text-sm text-gray-500 mt-1">
                  Fecha: {fecha.toLocaleDateString('es-ES')}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultasScreen;