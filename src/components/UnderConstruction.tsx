// src/components/UnderConstruction.tsx
import React from 'react';

// Importa el ícono de actualización
import updateIcon from '../assets/update.png';

// El componente recibirá una función 'onBack' para saber cómo regresar
interface Props {
  onBack: () => void;
}

// Ícono de la flecha para el botón "Atrás"
const BackArrowIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

const UnderConstruction: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white">
      {/* Barra de Navegación Superior */}
      <header className="bg-placeholder-purple text-white flex items-center p-4 shadow-md">
        <button onClick={onBack} className="flex items-center">
          <BackArrowIcon />
          <span className="ml-2 font-semibold">Atrás</span>
        </button>
        <h1 className="flex-grow text-center text-lg font-bold">
          Actualización en Curso
        </h1>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-6">
        <img src={updateIcon} alt="Actualización" className="w-24 h-24 animate-spin-slow" />
        
        <h2 className="text-2xl font-extrabold text-gray-900">
          Información en Actualización
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Estamos trabajando para brindarte los datos más recientes. Pronto estará disponible la información detallada.
        </p>

   <button 
  onClick={onBack} 
  className="bg-placeholder-purple text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-opacity-90 
             transition-transform duration-150 transform hover:scale-105 active:scale-95"
>
  Entendido
</button>
      </main>
    </div>
  );
};

export default UnderConstruction;