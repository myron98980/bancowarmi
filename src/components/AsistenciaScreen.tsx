// src/components/AsistenciaScreen.tsx
import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { type AsistenciaEstado } from '../types';

interface AsistenciaScreenProps {
  user: User;
  onBack: () => void;
}

// Un pequeño componente para mostrar un ícono según el estado
const StatusIcon: React.FC<{ status: AsistenciaEstado }> = ({ status }) => {
  // ... (implementación de íconos)
  return <span>{status.toUpperCase()}</span>; // Placeholder simple
};

const AsistenciaScreen: React.FC<AsistenciaScreenProps> = ({ user, onBack }) => {
  const [historial, setHistorial] = useState<{ fecha: Date, estado: AsistenciaEstado }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      setIsLoading(true);
      const reunionesRef = collection(db, 'reuniones');
      const q = query(reunionesRef, orderBy('fecha', 'desc')); // Ordena por fecha descendente
      const querySnapshot = await getDocs(q);
      
      const userHistorial: { fecha: Date, estado: AsistenciaEstado }[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const estadoUsuario = data.asistencias?.[user.uid];
        
        if (estadoUsuario) {
          userHistorial.push({
            fecha: (data.fecha as any).toDate(), // Convierte el timestamp de Firestore a Date
            estado: estadoUsuario,
          });
        }
      });
      
      setHistorial(userHistorial);
      setIsLoading(false);
    };

    fetchHistorial();
  }, [user.uid]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mi Historial de Asistencia</h2>
      {isLoading ? (
        <p>Cargando historial...</p>
      ) : historial.length === 0 ? (
        <p>Aún no tienes registros de asistencia.</p>
      ) : (
        <ul className="space-y-3">
          {historial.map((registro, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {registro.fecha.toLocaleDateString('es-ES', { dateStyle: 'long' })}
              </span>
              <span className="font-bold text-sm">
                <StatusIcon status={registro.estado} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AsistenciaScreen;