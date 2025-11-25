import React from 'react';

// Asegúrate de que tu ícono se llame 'update.png' y esté en 'src/assets/'
import updateIcon from '../assets/update.png';

// 1. Definimos la interfaz para las props.
//    El componente necesita recibir una función 'onClose' para funcionar.
interface PlaceholderContentProps {
  onClose: () => void;
}

// 2. El componente ahora recibe 'onClose' como prop.
const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 h-full mt-8">
      <img 
        src={updateIcon} 
        alt="Actualización" 
        className="w-24 h-24 animate-spin-slow opacity-75 object-contain" 
      />
      
      <h2 className="text-2xl font-extrabold text-gray-800">
        En Construcción
      </h2>

      <p className="text-gray-600 leading-relaxed max-w-xs">
        Esta sección estará disponible próximamente con nueva información y funcionalidades.
      </p>

      {/* 3. El botón "Entendido" ahora es funcional.
           Al hacer clic, ejecuta la función 'onClose' que viene desde App.tsx,
           lo que te devolverá a la pantalla de inicio. */}
      <button
        onClick={onClose}
        className="mt-4 px-6 py-2 bg-brand-purple text-white rounded-full font-semibold shadow-sm hover:bg-opacity-90 transition-colors"
      >
        Entendido
      </button>
    </div>
  );
};

export default PlaceholderContent;