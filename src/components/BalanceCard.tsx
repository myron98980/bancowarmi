import React from 'react';

// Tu patrón de fondo personalizado
const cardPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 8 L15 13 L9 13 Z' fill='%23FFF' fill-opacity='0.08'/%3E%3C/svg%3E")`;

const BalanceCard: React.FC = () => {

  // ===== LÓGICA PARA LA FECHA DINÁMICA INTEGRADA AQUÍ =====
  const getLatestMeetingDate = (): string => {
    const now = new Date();
    const lastMeetingDate = new Date(now);
    const dayOfWeek = now.getDay(); // 0=Domingo, 2=Martes
    const hour = now.getHours();

    // 1. Calculamos cuántos días retroceder para llegar al último martes.
    const daysToSubtract = (dayOfWeek - 2 + 7) % 7;
    lastMeetingDate.setDate(now.getDate() - daysToSubtract);

    // 2. Si hoy es martes pero aún no son las 5 PM (17:00 hrs),
    // mostramos la fecha del martes de la semana pasada.
    if (dayOfWeek === 2 && hour < 17) {
      lastMeetingDate.setDate(lastMeetingDate.getDate() - 7);
    }
    
    // 3. Formateamos la fecha al formato "día de mes" en español.
    const formattedDate = lastMeetingDate.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
    });

    return `hasta ${formattedDate}`;
  };

  return (
    <div 
      className="bg-brand-purple rounded-2xl p-5 mx-4 text-white shadow-lg relative overflow-hidden"
      // Tus estilos de fondo personalizados se mantienen
      style={{ 
        backgroundImage: cardPattern,
        backgroundSize: '24px 24px',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-90">Mis Aportes Acumulados</p>
        
        {/* ===== CAMBIO 1: MONTO ACTUALIZADO A CERO ===== */}
        <p className="text-4xl font-extrabold mt-2 tracking-tight">S/ 0.00</p>
        
        <div className="flex justify-between items-center mt-4">
          
          {/* ===== CAMBIO 2: FECHA DINÁMICA ===== */}
          <p className="text-xs opacity-80">{getLatestMeetingDate()}</p>
          
      <button className="bg-brand-pink text-white text-xs font-bold py-2.5 px-5 rounded-full 
                   transition-transform duration-150 transform hover:scale-105 active:scale-95">
  Mi Reporte {'>'}
</button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;