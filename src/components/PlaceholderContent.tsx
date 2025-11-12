// src/components/PlaceholderContent.tsx
import React from 'react';

import updateIcon from '../assets/update.png';

const PlaceholderContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 h-full mt-8">
      {/* ===== ¡LA CORRECCIÓN ESTÁ AQUÍ! ===== */}
      <img 
        src={updateIcon} 
        alt="Actualización" 
        // Se añadió "object-contain" para evitar que la imagen se deforme
        className="w-24 h-24 animate-spin-slow opacity-75 object-contain" 
      />
      
      <h2 className="text-2xl font-extrabold text-gray-800">
        En Construcción
      </h2>

      <p className="text-gray-600 leading-relaxed max-w-xs">
        Esta sección estará disponible próximamente con nueva información y funcionalidades.
      </p>
    </div>
  );
};

export default PlaceholderContent;