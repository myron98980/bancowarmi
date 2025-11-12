import React from 'react';
import { type User } from 'firebase/auth'; // 1. Importamos el tipo User

import avatarGirl from '../assets/avatar-girl.png';
import avatarMen from '../assets/avatar-men.png';

const BackArrowIcon = () => (
  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

const getAvatarForName = (name: string): string => {
  const firstName = name.toLowerCase();
  if (firstName === 'cristhian') {
    return avatarMen;
  }
  return avatarGirl;
};

// 2. Actualizamos las props que el Header espera recibir
interface HeaderProps {
  view: 'home' | 'placeholder';
  user: User | null; // Cambiado de 'userName' a 'user' para tener más datos
  onBackClick: () => void;
  onAvatarClick: () => void; // Nueva prop para abrir el menú
}

const Header: React.FC<HeaderProps> = ({ view, user, onBackClick, onAvatarClick }) => {
  const nameToDisplay = user?.displayName || 'Usuario';
  const firstName = nameToDisplay.split(' ')[0];

  // 3. Lógica para decidir qué avatar mostrar
  // Si el usuario tiene una foto de perfil (photoURL), la usamos.
  // Si no, usamos la lógica de avatares por defecto.
  const avatarSrc = user?.photoURL || getAvatarForName(firstName);

  return (
    <header className="flex justify-between items-center p-6">
      {view === 'home' ? (
        // === VISTA DE INICIO (HOME) ===
        <>
          <div>
            <p className="text-md text-gray-500">Hola,</p>
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              {firstName}
            </h1>
          </div>
          {/* 4. El botón ahora llama a la función onAvatarClick */}
          <button onClick={onAvatarClick} className="transition-transform transform active:scale-95">
            <img 
              src={avatarSrc} 
              alt="Avatar de usuario" 
              className="h-12 w-12 rounded-full object-cover shadow-sm border-2 border-black"
            />
          </button>
        </>
      ) : (
        // === VISTA DE SUB-PANTALLA (PLACEHOLDER) ===
        <>
          <button onClick={onBackClick} className="flex items-center transition-transform transform active:scale-95">
            <BackArrowIcon />
            <span className="ml-2 font-semibold text-gray-800">Atrás</span>
          </button>
          <div className="w-12 h-12" /> 
        </>
      )}
    </header>
  );
};

export default Header;