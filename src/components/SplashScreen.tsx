import React from 'react';
// Importa la imagen del logo que acabas de guardar
import logo from '../assets/logo-splash.png'; 

const SplashScreen: React.FC = () => {
  return (
    // Contenedor principal que ocupa toda la pantalla y centra el contenido
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-purple-300">
      {/* La imagen del logo con una animación sutil de pulso */}
      <img 
        src={logo} 
        alt="Logo de Banco Warmi" 
        className="w-48 animate-pulse" 
      />
    </div>
  );
};

export default SplashScreen;